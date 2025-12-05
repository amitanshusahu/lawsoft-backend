/**
 * validate(schema) - middleware factory that expects a schema with optional keys: body, query, params
 */
export default function validate(schema) {
    return (req, res, next) => {
        try {
            // The schema is expected to be a Zod object with shape { body?, query?, params? }
            const toValidate = {};
            if (schema.shape?.body)
                toValidate.body = req.body;
            if (schema.shape?.query)
                toValidate.query = req.query;
            if (schema.shape?.params)
                toValidate.params = req.params;
            const result = schema.safeParse ? schema.safeParse(toValidate) : { success: true, data: toValidate };
            if (!result.success) {
                return res.status(400).json({ error: result.error.format ? result.error.format() : result.error });
            }
            // assign parsed values back
            if (result.data.body)
                req.body = result.data.body;
            // if (result.data.query) req.query = result.data.query;
            // if (result.data.params) req.params = result.data.params;
            // req.query/req.params may be implemented as getter-only properties in some Node/Express setups.
            // Avoid direct assignment which can throw "Cannot set property query of #<IncomingMessage> which has only a getter".
            if (result.data.query) {
                const parsedQuery = result.data.query;
                if (req.query && typeof req.query === 'object') {
                    Object.keys(parsedQuery).forEach((k) => {
                        ;
                        req.query[k] = parsedQuery[k];
                    });
                }
                else {
                    try {
                        ;
                        req.query = parsedQuery;
                    }
                    catch (e) {
                        // swallow - not much we can do; downstream handlers will still see original req.query
                    }
                }
            }
            if (result.data.params) {
                const parsedParams = result.data.params;
                if (req.params && typeof req.params === 'object') {
                    Object.keys(parsedParams).forEach((k) => {
                        ;
                        req.params[k] = parsedParams[k];
                    });
                }
                else {
                    try {
                        ;
                        req.params = parsedParams;
                    }
                    catch (e) {
                        // ignore
                    }
                }
            }
            return next();
        }
        catch (err) {
            return res.status(400).json({ error: String(err.message ?? err) });
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map