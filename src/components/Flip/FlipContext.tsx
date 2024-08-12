import { createContext } from "react";
import {  FlipCallbacks } from "./types";

const FlipContext = createContext({} as FlipCallbacks);

export default FlipContext;