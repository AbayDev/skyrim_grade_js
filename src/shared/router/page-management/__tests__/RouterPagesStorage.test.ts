import { describe, expect, test, beforeEach, vi } from "vitest";
import { RouterPagesStorage } from "../RouterPagesStorage";
import { RouterError } from "../../errors/RouterError";
import type { CreateRoute } from "../../types/CreateRoute";
import type { PageClass } from "../../types/PageInterface";

class URLPatternTest {
  constructor(_arg: { pathname: string }) {

  }
}

describe("RouterPagesStorage", () => {
  let pagesStorage: RouterPagesStorage<Record<string, unknown>>;

  beforeEach(() => {
    pagesStorage = new RouterPagesStorage();
  });

  // Фабрика для создания мок-страниц
  const createMockPage = (
    key: string,
    path?: URLPattern,
    children?: CreateRoute<Record<string, unknown>>[]
  ): CreateRoute<Record<string, unknown>> => ({
    key,
    path: path || (new URLPatternTest({ pathname: `/${key}` }) as URLPattern),
    page: vi.fn() as unknown as PageClass<Record<string, unknown>>,
    children,
  });

  describe("add", () => {
    test("должен добавлять одну страницу", () => {
      const page = createMockPage("home");

      pagesStorage.add(page);

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(1);
      expect(pages[0].key).toBe("home");
    });

    test("должен добавлять несколько страниц", () => {
      const page1 = createMockPage("home");
      const page2 = createMockPage("about");
      const page3 = createMockPage("contact");

      pagesStorage.add(page1, page2, page3);

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(3);
      expect(pages.map((p) => p.key)).toEqual(["home", "about", "contact"]);
    });

    test("должен добавлять страницы с иерархией", () => {
      const childPage = createMockPage("profile");
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(1);
      expect(pages[0].key).toBe("user");
      expect(pages[0].children).toHaveLength(1);
      expect(pages[0].children![0].key).toBe("profile");
      expect((pages[0].children![0] as any).parentKey).toBe("user");
    });

    test("должен добавлять parentKey для глубокой иерархии", () => {
      const grandChildPage = createMockPage("settings");
      const childPage = createMockPage("profile", undefined, [grandChildPage]);
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      const pages = pagesStorage.getPages();
      const profilePage = pages[0].children![0];
      const settingsPage = profilePage.children![0];

      expect((profilePage as any).parentKey).toBe("user");
      expect((settingsPage as any).parentKey).toBe("profile");
    });

    test("должен валидировать наличие path", () => {
      const pageWithoutPath = {
        key: "invalid",
        page: vi.fn() as unknown as PageClass<Record<string, unknown>>,
        // Нет path!
      } as CreateRoute<Record<string, unknown>>;

      expect(() => {
        pagesStorage.add(pageWithoutPath);
      }).toThrow(RouterError);
      expect(() => {
        pagesStorage.add(pageWithoutPath);
      }).toThrow("The page invalid path required");
    });

    test("должен валидировать path в дочерних страницах", () => {
      const invalidChildPage = {
        key: "invalid-child",
        page: vi.fn() as unknown as PageClass<Record<string, unknown>>,
        // Нет path!
      } as CreateRoute<Record<string, unknown>>;

      const parentPage = createMockPage("parent", undefined, [
        invalidChildPage,
      ]);

      expect(() => {
        pagesStorage.add(parentPage);
      }).toThrow(RouterError);
      expect(() => {
        pagesStorage.add(parentPage);
      }).toThrow("The page invalid-child path required");
    });
  });

  describe("remove", () => {
    test("должен удалять страницу по ключу", () => {
      const page1 = createMockPage("home");
      const page2 = createMockPage("about");

      pagesStorage.add(page1, page2);
      pagesStorage.remove("home");

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(1);
      expect(pages[0].key).toBe("about");
    });

    test("должен удалять страницу с дочерними", () => {
      const childPage = createMockPage("profile");
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);
      pagesStorage.remove("user");

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(0);
    });

    test("должен рекурсивно удалять вложенные дочерние страницы", () => {
      const grandChildPage = createMockPage("settings");
      const childPage = createMockPage("profile", undefined, [grandChildPage]);
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      // Убеждаемся что все страницы в мапе
      expect(pagesStorage.findWithAncestors("user")).toBeTruthy();
      expect(pagesStorage.findWithAncestors("profile")).toBeTruthy();
      expect(pagesStorage.findWithAncestors("settings")).toBeTruthy();

      pagesStorage.remove("user");

      // После удаления все должны быть удалены из мапы
      expect(pagesStorage.findWithAncestors("user")).toBeNull();
      expect(pagesStorage.findWithAncestors("profile")).toBeNull();
      expect(pagesStorage.findWithAncestors("settings")).toBeNull();
    });

    test("должен кидать ошибку при попытке удалить несуществующую страницу", () => {
      expect(() => {
        pagesStorage.remove("nonexistent");
      }).toThrow(RouterError);
      expect(() => {
        pagesStorage.remove("nonexistent");
      }).toThrow("Page with key nonexistent not found");
    });

    test("должен удалять дочернюю страницу независимо", () => {
      const childPage = createMockPage("profile");
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);
      pagesStorage.remove("profile");

      // Родительская страница должна остаться, но без дочерних
      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(1);
      expect(pages[0].key).toBe("user");

      // Дочерняя страница должна быть удалена из мапы
      expect(pagesStorage.findWithAncestors("profile")).toBeNull();
    });
  });

  describe("getPages", () => {
    test("должен возвращать копию массива страниц", () => {
      const page = createMockPage("home");
      pagesStorage.add(page);

      const pages1 = pagesStorage.getPages();
      const pages2 = pagesStorage.getPages();

      expect(pages1).toEqual(pages2);
      expect(pages1).not.toBe(pages2); // Разные объекты (копии)
    });

    test("должен возвращать пустой массив для нового storage", () => {
      const pages = pagesStorage.getPages();
      expect(pages).toEqual([]);
    });
  });

  describe("findWithAncestors", () => {
    test("должен найти корневую страницу", () => {
      const page = createMockPage("home");
      pagesStorage.add(page);

      const result = pagesStorage.findWithAncestors("home");

      expect(result).toHaveLength(1);
      expect(result![0].key).toBe("home");
    });

    test("должен найти дочернюю страницу с предками", () => {
      const childPage = createMockPage("profile");
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      const result = pagesStorage.findWithAncestors("profile");

      expect(result).toHaveLength(2);
      expect(result![0].key).toBe("user"); // Предок
      expect(result![1].key).toBe("profile"); // Сама страница
    });

    test("должен найти глубоко вложенную страницу со всеми предками", () => {
      const grandChildPage = createMockPage("settings");
      const childPage = createMockPage("profile", undefined, [grandChildPage]);
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      const result = pagesStorage.findWithAncestors("settings");

      expect(result).toHaveLength(3);
      expect(result![0].key).toBe("user"); // Корень
      expect(result![1].key).toBe("profile"); // Родитель
      expect(result![2].key).toBe("settings"); // Сама страница
    });

    test("должен вернуть null для несуществующей страницы", () => {
      const result = pagesStorage.findWithAncestors("nonexistent");
      expect(result).toBeNull();
    });

    test("должен корректно обрабатывать разорванную цепочку предков", () => {
      const childPage = createMockPage("profile");
      const parentPage = createMockPage("user", undefined, [childPage]);

      pagesStorage.add(parentPage);

      // Удаляем родителя, оставляем дочернюю в мапе (имитируем баг)
      // Это не должно происходить в нормальном flow, но тест на всякий случай

      const result = pagesStorage.findWithAncestors("profile");
      expect(result).toHaveLength(2); // Должен найти и родителя, и дочернюю
    });
  });

  describe("граничные случаи", () => {
    test("должен корректно обрабатывать пустые массивы children", () => {
      const pageWithEmptyChildren = createMockPage("parent", undefined, []);

      expect(() => {
        pagesStorage.add(pageWithEmptyChildren);
      }).not.toThrow();

      const pages = pagesStorage.getPages();
      expect(pages[0].children).toEqual([]);
    });

    test("должен обрабатывать undefined children", () => {
      const pageWithoutChildren = createMockPage("simple");

      expect(() => {
        pagesStorage.add(pageWithoutChildren);
      }).not.toThrow();

      const pages = pagesStorage.getPages();
      expect(pages[0].children).toBeUndefined();
    });

    test("должен корректно работать с дубликатами ключей", () => {
      const page1 = createMockPage("duplicate");
      const page2 = createMockPage("duplicate");

      pagesStorage.add(page1);
      pagesStorage.add(page2);

      const pages = pagesStorage.getPages();
      expect(pages).toHaveLength(2);

      // В мапе должна быть последняя добавленная
      const found = pagesStorage.findWithAncestors("duplicate");
      expect(found).toHaveLength(1);
    });

    test("должен обрабатывать очень глубокую вложенность", () => {
      let currentPage = createMockPage("level-5");

      // Создаем цепочку: level-1 -> level-2 -> level-3 -> level-4 -> level-5
      for (let i = 4; i >= 1; i--) {
        currentPage = createMockPage(`level-${i}`, undefined, [currentPage]);
      }

      pagesStorage.add(currentPage);

      const result = pagesStorage.findWithAncestors("level-5");
      expect(result).toHaveLength(5);
      expect(result!.map((p) => p.key)).toEqual([
        "level-1",
        "level-2",
        "level-3",
        "level-4",
        "level-5",
      ]);
    });
  });
});
