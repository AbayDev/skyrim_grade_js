import type { PageInterface } from "../../../../shared/router";

export default class TasksPage implements PageInterface {
  key: string = "TasksPage";
  mount(): HTMLElement | Promise<HTMLElement> {
    const page = document.createElement("div");
    page.innerText = "TaskPage";
    return page;
  }
}
