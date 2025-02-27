const LoadPage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  return <div>page</div>;
};

export default LoadPage;
