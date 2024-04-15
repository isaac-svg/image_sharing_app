import { Button as AntBtn } from "antd";
type Props = {
  className: string;
  children: React.ReactNode | string;
};

const Button = ({ className, children }: Props) => {
  return (
    <div className={`${className}`}>
      <AntBtn type="primary">{children}</AntBtn>
    </div>
  );
};

export default Button;
