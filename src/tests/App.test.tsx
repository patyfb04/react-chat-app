import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Auth from "../components/Auth";
import Dashboard from "../components/Dashboard";
import { create } from "zustand";

const useTestChatStore = create(() => ({
  user: null,
  setUser: (user) => useTestChatStore.setState({ user }),
  currentRoom: null,
  setCurrentRoom: () => {},
}));

vi.mock("../store/chatStore", () => ({
  useChatStore: () => useTestChatStore(),
}));

vi.mock("../components/Auth", () => ({
  default: () => <div>Login</div>,
}));

vi.mock("../components/Dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

const queryClient = new QueryClient();

describe("App Component Tests", () => {
  beforeEach(() => {
    useTestChatStore.setState({ user: null });
    vi.restoreAllMocks();
  });

  it("renders Auth when user is not authenticated", async () => {
    vi.spyOn(supabase.auth, "getSession").mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.spyOn(supabase.auth, "onAuthStateChange").mockImplementation(
      (callback) => {
        setTimeout(() => {
          callback("SIGNED_OUT", null);
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }
    );

    render(<Auth />);
    expect(await screen.findByText("Login")).toBeInTheDocument();
  });

  it("renders Dashboard when user is  authenticated", async () => {
    vi.spyOn(supabase.auth, "getSession").mockResolvedValue({
      data: {
        session: {
          user: { id: "123", email: "test@example.com" },
        },
      },
    });

    vi.spyOn(supabase.auth, "onAuthStateChange").mockImplementation(
      (callback) => {
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: { id: "123", email: "test@example.com" },
          });
        }, 0);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }
    );

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("dashboard")).toBeInTheDocument();
    });
  });
});
