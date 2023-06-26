import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface IProps {
  children: React.ReactNode;
}

const CaptchaContainer: React.FC<IProps> = ({ children }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LeMZTcmAAAAAHrJJBeh_1L3FqVTYfXCYVJ_RHuY"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default CaptchaContainer;
