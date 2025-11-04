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
    <Card className="bg-bg-light !shadow-base flex h-full w-full items-center justify-center rounded-lg py-4">
      <CardHeader>
        <div className="mx-auto text-center">
          <h1 className="text-text my-5 text-5xl font-bold">{heading}</h1>
          <p className="text-text-muted">
            Access a secure and trusted certificate
            <br />
            verification platform.
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mx-auto w-[90%]">
          <Button
            data-hover={false}
            className="bg-primary w-full rounded-sm text-lg font-bold text-white transition-all delay-75 duration-100 hover:-translate-y-0.5 active:translate-y-0.5"
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
          <div className="mt-3 flex justify-center gap-1">
            <LuLockKeyhole className="text-gray-600" />
            <p className="text-text-muted text-center text-sm">
              Secure blockchain-based certificate verification
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default AuthCard;
