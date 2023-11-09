import Auth from "../classes/auth";
import { container } from "tsyringe";

export const authFactory = () => {
  return container.resolve(Auth);
};
