import type { CreateRoute } from "../../types/CreateRoute";
import type { Route } from "../../types/Route";
import type { RouteLocation } from "../../types/RouteLocation";
import type { RouterContext } from "../../types/RouterContext";

export interface RouterInterface<RouterContextType> {
  /**
   * добавить страницу(ы)
   * @param pages - страницы
   */
  addPage(...pages: CreateRoute<RouterContextType>[]): this;

  /**
   * Удалить страницу по уникальному ключу
   * @param key уникальный ключ
   */
  removePage(key: string): this;

  /**
   * Перейти к странице
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

  /**
   * Инициализация контекста куда можно передать глобальные свойства для страниц
   * @param context - объект который будет передаваться страницам
   */
  initRouterContext(context: RouterContext<RouterContextType>): this;

  /**
   * Начало рендеринга страниц
   */
  startRender(): this;
}
