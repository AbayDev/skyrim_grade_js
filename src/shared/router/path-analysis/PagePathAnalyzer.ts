import type { PageInfo } from "../types/PageInfo";
import type { RouteParams } from "../types/RouteParams";
import type { RouteQuery } from "../types/RouteQuery";
import type { PagePathAnalyzerInterface } from "./contracts/PagePathAnalyzerInterface";

export class PagePathAnalyzer implements PagePathAnalyzerInterface {
  /**
   * Поделить путь на сегменты
   * @param path - путь
   * @param limit - лимит на количество сегментов
   */
  public pathToSegments(path: string, limit?: number) {
    return path.split("/", limit).filter(Boolean);
  }

  /**
   * Получить query params из пути в виде RouteQuery
   * @param path - путь к странице
   */
  public getPathQueryParams(path: string): RouteQuery {
    const queryString = path.split("?")[1];
    if (!queryString) return {};
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params.entries());
  }

  /**
   * Сгенерировать путь к странице на основе ииерархии структуры страниц
   * @param pages - список страниц, где у каждого есть url pattern
   * @param params - параметры страниц
   * @param query - query параметры
   */
  public generatePathByPages(
    pages: PageInfo[],
    params?: RouteParams,
    query?: RouteQuery
  ): string {
    let path = "";

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      if (page.path.hasRegExpGroups && params) {
        // Заменяем динамические параметры на их значения
        let pagePath = page.path.pathname;
        Object.entries(params).forEach(([key, value]) => {
          pagePath = pagePath.replace(`:${key}`, value);
        });
        path += pagePath.startsWith("/") ? pagePath : `/${pagePath}`;
      } else {
        path += page.path.pathname.startsWith("/")
          ? page.path.pathname
          : `/${page.path.pathname}`;
      }
    }

    // Добавляем query параметры если есть
    if (query && Object.keys(query).length > 0) {
      const queryString = new URLSearchParams(query).toString();
      path += `?${queryString}`;
    }

    return path;
  }

  /**
   * Найти страницы по ииерархии по пути используя URLPattern
   * @param path - путь
   * @param pages - страницы где искать
   */
  public findPagesByPath(
    path: string,
    pages: PageInfo[]
  ): {
    pages: PageInfo[];
    params: RouteParams;
    pathSegments: string[];
  } {
    let foundPages: PageInfo[] = [];
    let params: RouteParams = {};
    let pathSegments = this.pathToSegments(path);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      // Используем URLPattern для проверки соответствия
      const normalizedPath = path.startsWith("/") ? path : "/" + path;
      const result = page.path.exec({ pathname: normalizedPath });

      if (result) {
        // Страница найдена - URLPattern совпал
        foundPages.push(page);

        // Извлекаем параметры из URLPattern
        if (result.pathname.groups) {
          params = { ...params, ...result.pathname.groups };
        }

        // Вычисляем сколько сегментов пути было "потреблено" этим паттерном
        let consumedLength = 0;

        const pagePathSegments = this.pathToSegments(
          page.path.pathname
        );
        consumedLength = pagePathSegments.length;

        // Вычисляем оставшуюся часть пути для дочерних страниц
        const remainingPathSegments = pathSegments.slice(consumedLength);
        const remainingPath = remainingPathSegments.join("/");

        // Если есть дочерние страницы и осталась необработанная часть пути
        if (page.children?.length && remainingPath) {
          const childResult = this.findPagesByPath(
            remainingPath,
            page.children
          );

          if (childResult.pages.length) {
            foundPages.push(...childResult.pages);
            params = { ...params, ...childResult.params };
            pathSegments = childResult.pathSegments;
          }
        } else {
          // Обновляем pathSegments для оставшейся части
          pathSegments = remainingPathSegments;
        }

        break;
      }
    }

    return {
      pages: foundPages,
      params,
      pathSegments,
    };
  }
}
