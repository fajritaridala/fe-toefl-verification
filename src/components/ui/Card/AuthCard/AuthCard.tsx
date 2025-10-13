import { LuLockKeyhole } from 'react-icons/lu';
import { Button, Card, CardBody, CardHeader, Spinner } from '@heroui/react';

type Props = {
  handleOnPress: () => void;
  isLoading: boolean;
  heading: string;
  buttonLabel: string;
};

function AuthCard(props: Props) {
  const { handleOnPress, isLoading, heading, buttonLabel } = props;

  return (
    <Card className="flex h-[22vh] w-[92%] items-center justify-center bg-white md:h-[38vh] md:w-[38vw]">
      <CardHeader className="mt-3">
        <div className="mx-auto text-center">
          <h1 className="text-primary-800 mb-2 text-[2.3rem] font-bold">
            {heading}
          </h1>
          <p className="text-sm text-gray-500">
            Access a secure and trusted certificate
            <br />
            verification platform.
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mx-auto w-[90%]">
          <Button
            variant="solid"
            className="bg-primary-800 w-full font-semibold text-white"
            onPress={handleOnPress}
          >
            {isLoading ? (
              <Spinner
                variant="wave"
                color="current"
                className="bottom-2 text-white"
              />
            ) : (
              buttonLabel
            )}
          </Button>
          <div className="mt-2 flex scale-90 justify-center gap-1">
            <LuLockKeyhole className="text-gray-600" />
            <p className="text-center text-[.8rem] text-gray-600">
              Secure blockchain-based certificate verification
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AuthCard;
