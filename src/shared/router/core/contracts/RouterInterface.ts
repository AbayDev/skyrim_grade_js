import type { CreateRoute } from "../../types/CreateRoute";
import type { Route } from "../../types/Route";
import type { RouteLocation } from "../../types/RouteLocation";

export interface RouterInterface {
  /**
   * добавить страницу(ы)
   * @param pages - страницы
   */
  addPage(...pages: CreateRoute[]): void;

  /**
   * Удалить страницу по уникальному ключу
   * @param key уникальный ключ
   */
  removePage(key: string): void;

  /**
   * Перейти к страницу
   * @param to - переход куда в виде пути или в виде объекта
   */
  navigate(to: string | RouteLocation): Promise<void>;

  /**
   * Перейти назад
   */
  back(): Promise<void>;

  /**
   * Получить текущий route, где хринится информация о текущей странице,
   * динамических параметров и query параметров
   */
  getCurrentRoute(): Route;
}
