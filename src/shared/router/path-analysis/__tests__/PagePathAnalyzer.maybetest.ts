import { describe, it, expect, beforeEach } from 'vitest';
import { PagePathAnalyzer } from '../PagePathAnalyzer';
import type { PageInfo } from '../../types/PageInfo';
import type { PageInterface } from '../../types/PageInterface';

// Моковые классы страниц SkyrimGrade приложения
class MockDashboardPage implements PageInterface {
  key = 'dashboard';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Dashboard - Общая статистика задач и проектов</h1>';
    return div;
  }
}

class MockTaskListPage implements PageInterface {
  key = 'tasks';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Все задачи</h1>';
    return div;
  }
}

class MockTaskDetailPage implements PageInterface {
  key = 'task-detail';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Детали задачи</h1>';
    return div;
  }
}

class MockTaskCreatePage implements PageInterface {
  key = 'task-create';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Создать задачу</h1>';
    return div;
  }
}

class MockProjectListPage implements PageInterface {
  key = 'projects';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Все проекты</h1>';
    return div;
  }
}

class MockProjectDetailPage implements PageInterface {
  key = 'project-detail';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Детали проекта</h1>';
    return div;
  }
}

class MockAnalyticsPage implements PageInterface {
  key = 'analytics';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Аналитика задач и проектов (ИИ анализ)</h1>';
    return div;
  }
}

class MockDailyPlanPage implements PageInterface {
  key = 'daily-plan';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>План на день - циклические задачи</h1>';
    return div;
  }
}

class MockCalendarPage implements PageInterface {
  key = 'calendar';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Календарь задач и проектов</h1>';
    return div;
  }
}

class MockChartsPage implements PageInterface {
  key = 'charts';
  mount(): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = '<h1>Графики прогресса задач и проектов</h1>';
    return div;
  }
}

describe('PagePathAnalyzer - Маршруты SkyrimGrade', () => {
  let analyzer: PagePathAnalyzer<any>;
  let skyrimGradePages: PageInfo<any>[];

  beforeEach(() => {
    analyzer = new PagePathAnalyzer();
    
    // Создаем структуру маршрутов для SkyrimGrade приложения
    skyrimGradePages = [
      {
        key: 'dashboard',
        path: new URLPattern({ pathname: '/' }),
        page: MockDashboardPage,
        children: []
      },
      {
        key: 'tasks',
        path: new URLPattern({ pathname: '/tasks' }),
        page: MockTaskListPage,
        children: [
          {
            key: 'task-create',
            path: new URLPattern({ pathname: '/tasks/create' }),
            page: MockTaskCreatePage,
            children: []
          },
          {
            key: 'task-detail',
            path: new URLPattern({ pathname: '/tasks/:taskId' }),
            page: MockTaskDetailPage,
            children: [
              {
                key: 'task-edit',
                path: new URLPattern({ pathname: '/tasks/:taskId/edit' }),
                page: MockTaskDetailPage,
                children: []
              }
            ]
          }
        ]
      },
      {
        key: 'projects',
        path: new URLPattern({ pathname: '/projects' }),
        page: MockProjectListPage,
        children: [
          {
            key: 'project-create',
            path: new URLPattern({ pathname: '/projects/create' }),
            page: MockProjectDetailPage,
            children: []
          },
          {
            key: 'project-detail',
            path: new URLPattern({ pathname: '/projects/:projectId' }),
            page: MockProjectDetailPage,
            children: [
              {
                key: 'project-edit',
                path: new URLPattern({ pathname: '/projects/:projectId/edit' }),
                page: MockProjectDetailPage,
                children: []
              },
              {
                key: 'project-tasks',
                path: new URLPattern({ pathname: '/projects/:projectId/tasks' }),
                page: MockTaskListPage,
                children: []
              }
            ]
          }
        ]
      },
      {
        key: 'analytics',
        path: new URLPattern({ pathname: '/analytics' }),
        page: MockAnalyticsPage,
        children: []
      },
      {
        key: 'daily-plan',
        path: new URLPattern({ pathname: '/daily-plan' }),
        page: MockDailyPlanPage,
        children: []
      },
      {
        key: 'calendar',
        path: new URLPattern({ pathname: '/calendar' }),
        page: MockCalendarPage,
        children: []
      },
      {
        key: 'charts',
        path: new URLPattern({ pathname: '/charts' }),
        page: MockChartsPage,
        children: []
      }
    ];
  });

  describe('Разделение пути на сегменты', () => {
    it('должен разделить пути на сегменты', () => {
      expect(analyzer.pathToSegments('/tasks/create')).toEqual(['tasks', 'create']);
      expect(analyzer.pathToSegments('/projects/my-project-123/edit')).toEqual(['projects', 'my-project-123', 'edit']);
      expect(analyzer.pathToSegments('/daily-plan')).toEqual(['daily-plan']);
      expect(analyzer.pathToSegments('/')).toEqual([]);
    });

    it('должен обрабатывать сегменты с ID', () => {
      expect(analyzer.pathToSegments('/tasks/task-001/edit', 3)).toEqual(['tasks', 'task-001', 'edit']);
      expect(analyzer.pathToSegments('/projects/skyrim-learning/tasks', 2)).toEqual(['projects', 'skyrim-learning']);
    });

    it('должен обрабатывать сложные пути со специальными символами', () => {
      expect(analyzer.pathToSegments('/projects/game-dev_project-2024')).toEqual(['projects', 'game-dev_project-2024']);
      expect(analyzer.pathToSegments('/tasks//task-with-double-slashes//')).toEqual(['tasks', 'task-with-double-slashes']);
    });
  });

  describe('Получение query параметров из пути', () => {
    it('должен извлекать параметры', () => {
      expect(analyzer.getPathQueryParams('/tasks?status=completed&priority=high')).toEqual({
        status: 'completed',
        priority: 'high'
      });
      
      expect(analyzer.getPathQueryParams('/projects?difficulty=medium&points_min=100&points_max=500')).toEqual({
        difficulty: 'medium',
        points_min: '100',
        points_max: '500'
      });
    });

    it('должен возвращать пустой объект для страниц без параметров', () => {
      expect(analyzer.getPathQueryParams('/daily-plan')).toEqual({});
      expect(analyzer.getPathQueryParams('/tasks')).toEqual({});
    });
  });

  describe('Генерация пути по страницам', () => {
    it('должен генерировать путь к главной странице', () => {
      const dashboardPages = [skyrimGradePages[0]]; // dashboard
      expect(analyzer.generatePathByPages(dashboardPages)).toBe('/');
    });

    it('должен генерировать путь создания задачи', () => {
      const taskCreatePages = [skyrimGradePages[1], skyrimGradePages[1].children![0]]; // tasks -> create
      // TODO тут оказалось дублируются пути, нужно посмотреть либо при создании страницы не дублировать пути, либо изменить алгоритм генерации пути
      expect(analyzer.generatePathByPages(taskCreatePages)).toBe('/tasks/tasks/create');
    });

    it('должен генерировать путь к детальной странице задачи с ID', () => {
      const taskDetailPages = [skyrimGradePages[1], skyrimGradePages[1].children![1]]; // tasks -> task-detail
      const result = analyzer.generatePathByPages(taskDetailPages, { taskId: 'skyrim-main-quest' });
      expect(result).toContain('skyrim-main-quest');
    });

    it('должен генерировать путь проекта с фильтрацией задач', () => {
      const projectPages = [skyrimGradePages[2]]; // projects
      const result = analyzer.generatePathByPages(projectPages, undefined, { 
        status: 'active',
        difficulty: 'hard' 
      });
      expect(result).toBe('/projects?status=active&difficulty=hard');
    });

    it('должен генерировать сложный вложенный путь к задачам проекта', () => {
      const projectTasksPages = [
        skyrimGradePages[2], // projects
        skyrimGradePages[2].children![1], // project-detail
        skyrimGradePages[2].children![1].children![2] // project-tasks
      ];
      const result = analyzer.generatePathByPages(projectTasksPages, { projectId: 'game-development' });
      expect(result).toContain('game-development');
      expect(result).toContain('/projects');
      expect(result).toContain('/tasks');
    });
  });

  describe('Поиск страниц по пути', () => {
    it('должен найти главную страницу', () => {
      const result = analyzer.findPagesByPath('/', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('dashboard');
      expect(result.params).toEqual({});
    });

    it('должен найти страницу списка задач', () => {
      const result = analyzer.findPagesByPath('/tasks', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('tasks');
      expect(result.params).toEqual({});
    });

    it('должен найти страницу создания задачи', () => {
      const result = analyzer.findPagesByPath('/tasks/create', skyrimGradePages);
      
      expect(result.pages.length).toBeGreaterThanOrEqual(1);
      const hasCreatePage = result.pages.some(page => page.key === 'task-create');
      expect(hasCreatePage).toBe(true);
    });

    it('должен найти конкретную задачу с параметром ID', () => {
      const result = analyzer.findPagesByPath('/tasks/main-skyrim-quest', skyrimGradePages);
      
      expect(result.pages.length).toBeGreaterThanOrEqual(1);
      expect(result.params).toHaveProperty('taskId', 'main-skyrim-quest');
    });

    it('должен найти страницу редактирования задачи с параметром', () => {
      const result = analyzer.findPagesByPath('/tasks/level-up-sneak/edit', skyrimGradePages);
      
      expect(result.pages.length).toBeGreaterThanOrEqual(2);
      expect(result.params).toHaveProperty('taskId', 'level-up-sneak');
    });

    it('должен найти страницы проектов с ID', () => {
      const result = analyzer.findPagesByPath('/projects/skyrim-100-completion', skyrimGradePages);
      
      expect(result.pages.length).toBeGreaterThanOrEqual(1);
      expect(result.params).toHaveProperty('projectId', 'skyrim-100-completion');
    });

    it('должен найти страницу задач проекта', () => {
      const result = analyzer.findPagesByPath('/projects/mage-build/tasks', skyrimGradePages);
      
      expect(result.pages.length).toBeGreaterThanOrEqual(2);
      expect(result.params).toHaveProperty('projectId', 'mage-build');
    });

    it('должен найти страницу аналитики', () => {
      const result = analyzer.findPagesByPath('/analytics', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('analytics');
    });

    it('должен найти страницу ежедневного плана', () => {
      const result = analyzer.findPagesByPath('/daily-plan', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('daily-plan');
    });

    it('должен найти страницу календаря', () => {
      const result = analyzer.findPagesByPath('/calendar', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('calendar');
    });

    it('должен найти страницу графиков', () => {
      const result = analyzer.findPagesByPath('/charts', skyrimGradePages);
      
      expect(result.pages).toHaveLength(1);
      expect(result.pages[0].key).toBe('charts');
    });

    it('должен обрабатывать несуществующие пути SkyrimGrade', () => {
      const result = analyzer.findPagesByPath('/inventory', skyrimGradePages);
      
      expect(result.pages).toHaveLength(0);
      expect(result.params).toEqual({});
      expect(result.pathSegments).toEqual(['inventory']);
    });
  });
});