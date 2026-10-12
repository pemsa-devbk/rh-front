import { RouterProvider } from "react-router-dom"
import { router } from "./router/router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConfigProvider, notification } from "antd";
import { AuthInitializer } from "./pages/public/login/components/AuthInitializer";

function App() {

  const queryClient = new QueryClient();
  const [_, contextHolder] = notification.useNotification();

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          // token:{
          //   colorPrimary: '#010066',
          //   colorLink: '#558cc2',
          //   colorPrimaryHover: '#343296',
          //   colorTextHeading: '#ff0',
          //   colorText:'#0f0',
          //   colorTextBase: 'rgb(255, 0, 221)',

          //   colorPrimaryText: '#f00',
          //   colorTextLabel: '#afc',
          //   colorTextPlaceholder: 'rgb(73, 163, 37)',
          //   colorTextDescription: '#bbF',
          // },
          // components:{
          //   Input:{
          //     colorText:'rgb(24, 219, 89)',
          //     colorTextLabel: '#f00'
          //   }
          // }
        }}
      >
        {contextHolder}
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  )
}

export default App
