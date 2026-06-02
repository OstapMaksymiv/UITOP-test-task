import { AxiosError } from "axios";
import { getApiErrorMessage } from "./api";

describe("getApiErrorMessage", () => {
  it("returns the server-provided error message when present", () => {
    const error = new AxiosError("Request failed");
    error.response = {
      data: { error: "Category already has 5 active tasks." },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error, "fallback")).toBe(
      "Category already has 5 active tasks.",
    );
  });

  it("returns the fallback for a non-Axios error", () => {
    expect(getApiErrorMessage(new Error("boom"), "fallback")).toBe("fallback");
  });

  it("returns the fallback when the response has no error field", () => {
    const error = new AxiosError("Request failed");
    error.response = {
      data: {},
      status: 500,
      statusText: "Server Error",
      headers: {},
      config: {} as never,
    };

    expect(getApiErrorMessage(error, "fallback")).toBe("fallback");
  });
});
