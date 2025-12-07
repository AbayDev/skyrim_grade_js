import { RoutePage, type PageInterface } from "../../../../shared/router";

export default class TasksPage
  extends RoutePage<SkyrimGradeContext>
  implements PageInterface
{
  public key: string = "TasksPage";
  public mount(): HTMLElement | Promise<HTMLElement> {
    const page = document.createElement("div");
    page.innerText = "TaskPage";
    return page;
  }
}
