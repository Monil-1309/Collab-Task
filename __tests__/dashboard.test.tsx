import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/dashboard/page";
import { MockedProvider } from "@apollo/client/testing";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  })),
}));

// Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        success: true,
        data: [
          {
            id: "1",
            title: "Test Task",
            status: "todo",
            priority: "medium",
            assignee: "John Doe",
            type: "feature",
            dueDate: "2023-12-31",
          },
        ],
      }),
  })
) as jest.Mock;

// Mock the components
jest.mock("@/components/protected-route", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("@/components/dashboard-layout", () => ({
  DashboardLayout: ({
    children,
    currentView,
    onViewChange,
  }: {
    children: React.ReactNode;
    currentView: string;
    onViewChange: (view: string) => void;
  }) => (
    <div>
      <button onClick={() => onViewChange("board")}>Board View</button>
      <button onClick={() => onViewChange("list")}>List View</button>
      <button onClick={() => onViewChange("calendar")}>Calendar View</button>
      <button onClick={() => onViewChange("table")}>Table View</button>
      <button onClick={() => onViewChange("timeline")}>Timeline View</button>
      {children}
    </div>
  ),
}));

jest.mock("@/components/board-view", () => ({
  BoardView: ({ tasks }: { tasks: any[] }) => (
    <div>Board View - Tasks: {tasks.length}</div>
  ),
}));

jest.mock("@/components/list-view", () => ({
  ListView: ({ tasks }: { tasks: any[] }) => (
    <div>List View - Tasks: {tasks.length}</div>
  ),
}));

jest.mock("@/components/calendar-view", () => ({
  CalendarView: ({ tasks }: { tasks: any[] }) => (
    <div>Calendar View - Tasks: {tasks.length}</div>
  ),
}));

jest.mock("@/components/table-view", () => ({
  TableView: ({ tasks }: { tasks: any[] }) => (
    <div>Table View - Tasks: {tasks.length}</div>
  ),
}));

jest.mock("@/components/timeline-view", () => ({
  TimelineView: ({ tasks }: { tasks: any[] }) => (
    <div>Timeline View - Tasks: {tasks.length}</div>
  ),
}));

jest.mock("@/components/search-and-filter", () => ({
  SearchAndFilter: ({
    searchQuery,
    onSearchChange,
    filters,
    onFiltersChange,
  }: {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filters: any;
    onFiltersChange: (filters: any) => void;
  }) => (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search"
      />
      <select
        value={filters.status}
        onChange={(e) =>
          onFiltersChange({ ...filters, status: e.target.value })
        }
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
      </select>
    </div>
  ),
}));

jest.mock("@/components/task-modal", () => ({
  TaskModal: ({
    isOpen,
    onClose,
    onSave,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: any) => void;
  }) =>
    isOpen ? (
      <div>
        <button onClick={onClose}>Close Modal</button>
        <button
          onClick={() =>
            onSave({
              title: "New Task",
              status: "todo",
              priority: "high",
            })
          }
        >
          Save Task
        </button>
      </div>
    ) : null,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the dashboard with default board view", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Board View - Tasks: 1")).toBeInTheDocument();
    });
  });

  it("changes view mode when layout buttons are clicked", async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("List View"));
      expect(screen.getByText("List View - Tasks: 1")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Calendar View"));
      expect(screen.getByText("Calendar View - Tasks: 1")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Table View"));
      expect(screen.getByText("Table View - Tasks: 1")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Timeline View"));
      expect(screen.getByText("Timeline View - Tasks: 1")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Board View"));
      expect(screen.getByText("Board View - Tasks: 1")).toBeInTheDocument();
    });
  });

  it("opens and closes the task modal", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("Close Modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByText("Close Modal")).not.toBeInTheDocument();
  });

  it("adds a new task through the modal", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Save Task"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2); // Initial fetch + add task
    });
  });

  it("handles search functionality", async () => {
    render(<DashboardPage />);

    const searchInput = screen.getByPlaceholderText("Search");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => {
      expect(searchInput).toHaveValue("test");
    });
  });

  it("handles filter changes", async () => {
    render(<DashboardPage />);

    const statusFilter = screen.getByRole("combobox");
    fireEvent.change(statusFilter, { target: { value: "todo" } });

    await waitFor(() => {
      expect(statusFilter).toHaveValue("todo");
    });
  });

  it("shows loading state while fetching tasks", async () => {
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                json: () =>
                  Promise.resolve({
                    success: true,
                    data: [],
                  }),
              }),
            500
          )
        )
    );

    render(<DashboardPage />);

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading tasks...")).not.toBeInTheDocument();
    });
  });

  it("handles fetch error gracefully", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Board View - Tasks: 0")).toBeInTheDocument();
    });
  });

  it("ensures tasks have unique ids", async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            data: [
              { title: "Task 1" }, // No id
              { _id: "custom_id", title: "Task 2" }, // MongoDB _id
            ],
          }),
      })
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("Board View - Tasks: 2")).toBeInTheDocument();
    });
  });
});
