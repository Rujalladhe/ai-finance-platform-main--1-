// ArcJet disabled - rate limiting removed
// import arcjet, { tokenBucket } from "@arcjet/next";

// Mock arcjet object that does nothing
const aj = {
  protect: async (req, options) => {
    // Return a mock decision that always allows the request
    return {
      conclusion: "ALLOW",
      reason: "ARCJET_DISABLED",
    };
  },
};

export default aj;
