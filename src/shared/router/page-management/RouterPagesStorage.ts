import type { RouterPagesStorageInterface } from "./contracts/RouterPagesStorageInterface";
import { RouterError } from "../errors/RouterError";
import type { PageInfo } from "../types/PageInfo";
import type { CreateRoute } from "../types/CreateRoute";

export class RouterPagesStorage implements RouterPagesStorageInterface {
  private pages: PageInfo[] = [];
  private pagesMap = new Map<string, PageInfo>();

  private validatePagePath(page: PageInfo) {
    if (!page.path) {
      throw new RouterError(`The page ${page.key} path required`);
    }

    if (page.children) {
      page.children.forEach((page) => {
        this.validatePagePath(page);
      });
    }
  }

  /**
   * Добавить страницу в картку страниц по ииерархии
   * @param page
   */
  private addPageToMap(page: CreateRoute) {
    this.pagesMap.set(page.key, page);
    if (page.children) {
      page.children.forEach((page) => {
        this.addPageToMap(page);
      });
    }
  }

  /**
   * Подготовить данные о странице при создании
   */
  private addParentKeyToPages(page: CreateRoute): PageInfo {
    const result: PageInfo = { ...page };

    result.children = page.children?.map((child) => {
      const childCopy: PageInfo = { ...child };
      childCopy.parentKey = page.key;
      return this.addParentKeyToPages(childCopy);
    });

    return result;
  }

  /**
   * Добавить страницы
   */
  public add(...pages: CreateRoute[]) {
    pages.forEach((page) => {
      this.validatePagePath(page);
      const newPage = this.addParentKeyToPages(page);
      this.pages.push(newPage);
      this.addPageToMap(newPage);
    });
  }

  public removeByHierarchy(key: string, pages: PageInfo[]) {
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];

      if (page.key === key) {
        pages.splice(i, 1);
        this.pagesMap.delete(key);

        if (page.children) {
          page.children.forEach((child) => {
            this.removeByHierarchy(child.key, page.children!);
          });
        }
        break;
      }

      if (page.children?.length) {
        this.removeByHierarchy(key, page.children);
      }
    }
  }

  /**
   * Удалить страницу
   */
  public remove(key: string): void {
    const beforeSize = this.pagesMap.size;
    this.removeByHierarchy(key, this.pages);
    const afterSize = this.pagesMap.size;

    if (beforeSize === afterSize) {
      throw new RouterError(`Page with key ${key} not found`);
    }
  }

  public getPages() {
    return [...this.pages];
  }

  /**
   * Найти страницы по объекту RouteLocation
   */
  public findWithAncestors(key: string): PageInfo[] | null {
    const page = this.pagesMap.get(key);

    if (!page) {
      return null;
    }

    if (page?.parentKey) {
      const ancestors = this.findWithAncestors(page.parentKey);
      if (ancestors) {
        return [...ancestors, page];
      }
    }

    return [page];
  }
}
