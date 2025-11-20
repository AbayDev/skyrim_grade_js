import type { CreateRoute } from "../../types/CreateRoute";
import type { PageInfo } from "../../types/PageInfo";

/**
 * Хранилище страниц роута
 */
export interface RouterPagesStorageInterface<RouterContextType> {
  /**
   * Добавить страницу(ы)
   * @param pages - страницы
   */
  add(...pages: CreateRoute<RouterContextType>[]): void;
  /**
   * Ужалить страницу по уникальному ключу
   * @param key - уникальный ключ
   */
  remove(key: string): void;
  /**
   * Получить все страницы
   */
  getPages(): PageInfo<RouterContextType>[];

  /**
   * Найти страницу включая родителей
   * @param key - уникальный ключ страницы
   */
  findWithAncestors(key: string): PageInfo<RouterContextType>[] | null;
}
