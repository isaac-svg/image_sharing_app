import React, { useEffect } from "react";
import { Layout, Flex } from "antd";
import Header from "./components/Header";
// import Content from "./components/Content";
import { Outlet } from "react-router-dom";
import { useModal } from "./store/modal";

const { Footer } = Layout;

const App: React.FC = () => {
  const toggleloginModal = useModal((state) => state.toggleloginModal);
  useEffect(() => {
    if (window.location.href.includes("login")) {
      toggleloginModal(true);
    }
  }, [window.location.href]);
  return (
    <Flex gap="middle" wrap="wrap">
      <Layout className="rounded-md overflow-x-hidden w-[calc(100% - 8px)] max-w-[calc(100% - 8px)]">
        <Header />
        <Outlet />
        <Footer className="text-center text-white bg-blue-600">Memshare</Footer>
      </Layout>
    </Flex>
  );
};

export default App;
