import { useState } from "react";
import { Input } from "antd";
import { useImages } from "../store/images";

const { Search } = Input;
type Props = {
  loading: boolean;
};

const SearchBox = ({ loading }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string | undefined>();
  const searchCategory = useImages((state) => state.searchCategory);

  return (
    <>
      <Search
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="input search loading default"
        loading={isLoading}
        // onClick={async () => await searchCategory({ category })}
        onSearch={async () => {
          setIsLoading(true);
          await searchCategory({ category });
          setIsLoading(false);
        }}
      />
    </>
  );
};
export default SearchBox;
