import React from "react";
import { Layout, Flex } from "antd";
import Header from "./components/Header";
// import Content from "./components/Content";
import { Outlet } from "react-router-dom";

const { Footer } = Layout;

const App: React.FC = () => (
  <Flex gap="middle" wrap="wrap">
    <Layout className="rounded-md overflow-x-hidden w-[calc(100% - 8px)] max-w-[calc(100% - 8px)]">
      <Header />
      <Outlet />
      <Footer className="text-center text-white bg-blue-600">Footer</Footer>
    </Layout>
  </Flex>
);

export default App;
