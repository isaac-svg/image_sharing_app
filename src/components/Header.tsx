import SearchBox from "./Search";
import Button from "./Button";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Header as AntHeader } from "antd/es/layout/layout";
import { Flex, Spin } from "antd";
import { useModal } from "../store/modal";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const openModal = useModal((state) => state.openModal);
  const loading = useModal((state) => state.localmodals.loading);
  useEffect(() => {
    async function loadAuth() {
      await openModal();
    }
    loadAuth();
  }, []);
  const { upload } = useModal((state) => state.protectedmodals);
  return (
    <AntHeader className="border-b-2 min-h-14  w-full px-2 mx-auto bg-white">
      <Flex
        gap="small"
        className="w-full  "
        align="center"
        justify="space-between"
      >
        <Flex align="center" gap="small" className="flex-[0.7] gap-4">
          <div>
            <span className="text-2xl font-bold ">MemShare</span>
          </div>
          <SearchBox loading={true} />
        </Flex>
        <Link
          to={upload ? "/upload" : "/login"}
          onClick={async () => await openModal()}
        >
          <Button className="hidden md:block text-lg  text-white">
            {loading && (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 20, color: "white", marginRight: "6px" }}
                    spin
                  />
                }
              />
            )}
            Add Photo
          </Button>
          <Button className="block md:hidden  ">
            <PlusOutlined className="w-full text-white font-extrabold block  items-center justify-center " />
          </Button>
        </Link>
      </Flex>
    </AntHeader>
  );
};

export default Header;
