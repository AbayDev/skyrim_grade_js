import type { PageInfo } from "../../types/PageInfo";
import type { PageProps } from "../../types/PageInterface";

export interface RouterPageRenderingInterface {
  /**
   * Рендеринг страниц
   * 
   * Если родительская страница не имеет RouterView HTMLElement, то дочерняя страница не будет отредерена
   * 
   * @param pages - страница для редеринга от родителя до ребенка слева направо
   * @param pageProps - глобальные свойства страницы
   */
  renderPages(pages: PageInfo[], pageProps: PageProps): void;
}
