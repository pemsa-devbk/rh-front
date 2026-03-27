import { RouterProvider } from "react-router-dom"
import { router } from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { notification } from "antd";

function App() {

  const queryClient = new QueryClient();
  const [_, contextHolder] = notification.useNotification();

  return (
    <QueryClientProvider client={queryClient}>
      {contextHolder}
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
