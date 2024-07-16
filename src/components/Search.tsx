import { useState } from "react";
import { Input, message } from "antd";
import { useImages } from "../store/images";
import Message from "./Message";

const { Search } = Input;
type Props = {
  loading: boolean;
};

const SearchBox = ({ loading }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string | undefined>("");
  const [isError, setIsError] = useState<boolean>(false);

  const queryData = useImages((state) => state.queryData);
  const [messageApi, contextHolder] = message.useMessage();
  const giveError = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };

  return (
    <>
      {/* <Message /> */}
      {contextHolder}
      <Search
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="input search loading default"
        loading={isLoading}
        onSubmit={() => {
          if (query?.trim() === "") return;
          if (isLoading) giveError("Allow your previous memory to settle");
        }}
        // onClick={async () => await queryData({ query })}
        onSearch={async () => {
          setIsLoading(true);
          const result = await queryData({ query });
          if (!result) {
            giveError("Error Querying results");
          }
          setIsLoading(false);
        }}
      />
    </>
  );
};
export default SearchBox;
