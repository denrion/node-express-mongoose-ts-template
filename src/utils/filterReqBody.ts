const filterReqBody = (reqBody: any, ...allowedFields: string[]) => {
  const filteredBody: any = {};

  Object.keys(reqBody).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = reqBody[el];
  });

  return filteredBody;
};

export default filterReqBody;
