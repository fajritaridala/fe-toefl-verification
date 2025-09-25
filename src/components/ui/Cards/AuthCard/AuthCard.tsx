import { Button, Card, CardBody, Spinner } from '@heroui/react';

type Props = {
  handleOnPress: () => void;
  isLoading: boolean;
  heading: string;
  buttonLabel: string;
};

function AuthCard(props: Props) {
  const { handleOnPress, isLoading, heading, buttonLabel } = props;

  return (
    <Card className="flex h-[22vh] w-[80%] items-center justify-center lg:h-[25vh] lg:w-[30%]">
      <CardBody className="flex items-center justify-center">
        <h1 className="h-[55%] text-[2rem] font-bold text-black">{heading}</h1>
        <Button
          variant="solid"
          className="w-[90%] bg-black text-white"
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
        <p className="mt-1 text-center text-[.55rem] text-[#52525b]">
          Secure blockchain-based certificate verification
        </p>
      </CardBody>
    </Card>
  );
}

export default AuthCard;
