import { Button as AntBtn } from "antd";
type Props = {
  className: string;
  children: React.ReactNode | string;
};

const Button = ({ className, children }: Props) => {
  return (
    <div className={`${className}`}>
      <AntBtn type="primary" className="bg-green-600 hover:bg-green-600">
        {children}
      </AntBtn>
    </div>
  );
};

export default Button;
