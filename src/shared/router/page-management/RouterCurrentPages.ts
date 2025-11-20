import type { CurrentPagesInterface as RouterCurrentPagesInterface } from "./contracts/RouterCurrentPagesInterface";
import type { PageInterface } from "../types/PageInterface";

export class RouterCurrentPages implements RouterCurrentPagesInterface {
  private pages: PageInterface[] = [];

  public unmountPages() {
    if (!this.pages.length) {
      return;
    }

    // идем от обратного, что бы сперва размонтировались дети, а потом уже родители
    for (let i = this.pages.length - 1; i >= 0; i--) {
      this.pages[i].unmount?.();
    }

    this.pages = [];
  }

  public markCurrentPage(page: PageInterface) {
    this.pages.push(page);
  }

  public getCurrentPages(): PageInterface[] {
    return [...this.pages]
  }
}
