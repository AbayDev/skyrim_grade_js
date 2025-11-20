import type { PageInfo } from "../../types/PageInfo";
import type { RouteParams } from "../../types/RouteParams";
import type { RouteQuery } from "../../types/RouteQuery";

/**
 * Анализатор путей страниц
 */
export interface PagePathAnalyzerInterface {
  /**
   * Поделить путь на отдельные сегменты по "/" символу.
   * @param path - путь
   * @param limit - количество деления
   */
  pathToSegments(path: string, limit?: number): string[];
  /**
   * Получить query параметры из пути
   * @param path - путь
   */
  getPathQueryParams(path: string): RouteQuery;

  /**
   * Сгенерировать путь на основе страниц по ииерархии.
   *
   * @param pages список страниц от родителя к ребенку слева направо.
   * @param params динамические параметры
   * @param query query параметры
   */
  generatePathByPages(
    pages: PageInfo[],
    params?: RouteParams,
    query?: RouteQuery
  ): string;

  /**
   * Найти страницы пути которых совподают с основным путем.
   * 
   * @description
   * Функция найдет не только совподающие страница,
   * но и динамические параметры из пути в виде объекта,
   * для удобного чтения.
   * Также возвращает `pathToSegments`, в виде массива строк, которые считаются не потребленными.
   * То есть не найдено для них еще совпадения.
   * 
   * @param path - основной путь
   * @param pages - список страниц для сопоставления
   */
  findPagesByPath(
    path: string,
    pages: PageInfo[]
  ): {
    /**
     * Совподающие страницы
     */
    pages: PageInfo[];
    /**
     * Найденные динамические параметры
     */
    params: RouteParams;
    /**
     * Оставшийся не потребленные сегменты основной пути
     */
    pathSegments: string[];
  };
}
