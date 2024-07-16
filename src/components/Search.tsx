import { useState } from "react";
import { Input, message } from "antd";
import { useImages } from "../store/images";

const { Search } = Input;

const SearchBox = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string | undefined>("");

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
        placeholder="input search loading default flex-1"
        loading={isLoading}
        onSubmit={() => {
          if (query?.trim() === "") {
            giveError("Please query for something");
            return;
          }
          if (isLoading) giveError("Allow your previous memory to settle");
        }}
        // onClick={async () => await queryData({ query })}
        onSearch={async () => {
          setIsLoading(true);
          if (query?.trim() === "") {
            giveError("Please query for something");
            setIsLoading(false);
            return;
          }
          if (isLoading) giveError("Allow your previous memory to settle");
          const result = await queryData({ query });
          console.log(result);
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
