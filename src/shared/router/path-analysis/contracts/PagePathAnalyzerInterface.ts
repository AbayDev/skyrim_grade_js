import type { PageInfo } from "../../types/PageInfo";
import type { RouteParams } from "../../types/RouteParams";
import type { RouteQuery } from "../../types/RouteQuery";

/**
 * Анализатор путей страниц
 */
export interface PagePathAnalyzerInterface<RouterContextType> {
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
    pages: PageInfo<RouterContextType>[],
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
    pages: PageInfo<RouterContextType>[]
  ): {
    /**
     * Совподающие страницы
     */
    pages: PageInfo<RouterContextType>[];
    /**
     * Найденные динамические параметры
     */
    params: RouteParams;
    /**
     * Оставшийся не потребленные сегменты основной пути
     */
    pathSegments: string[];
  };

  /**
   * Извлечь из `pageOrUrl` путь к странице.
   * 
   * @description
   * Проверка на внутреннюю ссылку, если внутреняя корректирует ее.
   * 
   * Например если передать `http://localhost:5173/tasks?search=task 1`, то вернет `/tasks?search=task 1`.
   * 
   * По сути вырезает origin оставляя `путь к странице` + `поисковые параметры` + `хеш`
   *
   * @param pageOrUrl - полный url или путь к странице
   */
  extractOriginFromUrl(pageOrUrl: string): string;
}
