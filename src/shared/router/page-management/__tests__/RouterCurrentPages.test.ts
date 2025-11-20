import { describe, expect, test, vi, type MockInstance } from "vitest";
import { RouterCurrentPages } from "../RouterCurrentPages";
import type { PageInterface } from "../../types/PageInterface";

describe("RouterCurrentPages", () => {
  const createMockPage = (name: string = "test"): PageInterface => ({
    key: name,
    mount: vi.fn(),
    mounted: vi.fn(),
    unmount: vi.fn(),
  });

  test("markCurrentPages должен добавлять страницы", () => {
    const currentPages = new RouterCurrentPages();

    const pages = [
      createMockPage("1"),
      createMockPage("2"),
      createMockPage("3"),
    ];

    pages.forEach((page) => {
      currentPages.markCurrentPage(page);
    });

    expect(currentPages.getCurrentPages()).toEqual(pages);
  });

  test("getCurrentPages должен возвращать текущие страницы", () => {
    const currentPages = new RouterCurrentPages();

    const pages = [
      createMockPage("1"),
      createMockPage("2"),
      createMockPage("3"),
    ];

    pages.forEach((page) => {
      currentPages.markCurrentPage(page);
    });

    expect(currentPages.getCurrentPages()).toEqual(pages);
  });

  test("unmountPages должен вызвать для каждой страницы unmount и отчистить страницы", () => {
    const currentPages = new RouterCurrentPages();

    const pages = [
      createMockPage("1"),
      createMockPage("2"),
      createMockPage("3"),
    ];

    pages.forEach((page) => {
      currentPages.markCurrentPage(page);
    });

    expect(currentPages.getCurrentPages()).toEqual(pages);
    currentPages.unmountPages();
    expect(pages[2].unmount).toHaveBeenCalledBefore(pages[1].unmount as unknown as MockInstance);
    expect(pages[1].unmount).toHaveBeenCalledBefore(pages[0].unmount as unknown as MockInstance);
    expect(pages[0].unmount).toHaveBeenCalledAfter(pages[1].unmount as unknown as MockInstance);
    expect(currentPages.getCurrentPages()).toEqual([]);
  });
});
