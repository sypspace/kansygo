import { render, screen } from "@testing-library/react-native";

import DashboardScreen from "@/app/index";

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useFocusEffect: () => undefined,
}));

jest.mock("@/ui/providers/AppProvider", () => ({
  useAppServices: () => mockServices,
}));

const mockServices = {
  products: { list: async () => [] },
  agents: { list: async () => [] },
};

/**
 * Smoke test UI: memastikan pipeline RNTL berjalan dan Dashboard dasar dapat
 * dirender tanpa koneksi/back-end (AC-APP-001).
 *
 * Catatan: sejak React Native Testing Library v14, `render` bersifat async.
 */
describe("DashboardScreen", () => {
  it("menampilkan ringkasan operasional dasar", async () => {
    await render(<DashboardScreen />);

    expect(screen.getByText("Hari ini")).toBeTruthy();
    expect(screen.getByText("Outstanding")).toBeTruthy();
    expect(screen.getByText("Rp0")).toBeTruthy();
    expect(screen.getByText("Master Data")).toBeTruthy();
  });
});


