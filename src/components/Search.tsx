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
