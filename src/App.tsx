import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";

const TodoPage = lazy(() => import("./pages/TodoPage"));
const NotesPage = lazy(() => import("./pages/NotesPage"));
const PomodoroPage = lazy(() => import("./pages/PomodoroPage"));
const WeatherPage = lazy(() => import("./pages/WeatherPage"));

function RouteFallback() {
  return (
    <div className="shell py-16">
      <div className="skeleton h-8 w-48 rounded-full" />
      <div className="skeleton mt-5 h-[420px] rounded-3xl" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="todo"
          element={
            <Suspense fallback={<RouteFallback />}>
              <TodoPage />
            </Suspense>
          }
        />
        <Route
          path="notes"
          element={
            <Suspense fallback={<RouteFallback />}>
              <NotesPage />
            </Suspense>
          }
        />
        <Route
          path="pomodoro"
          element={
            <Suspense fallback={<RouteFallback />}>
              <PomodoroPage />
            </Suspense>
          }
        />
        <Route
          path="weather"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WeatherPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
