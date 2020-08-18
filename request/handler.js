exports.authorize = function (event, context, callback) {
    console.log(event);
    console.log(context);
    const token = event.headers["X-Auth"] || false;
    const methodArn = event.methodArn;
    console.log("==> TOKEN", token);

    switch (token.toLowerCase()) {
        case 'allow':
            event.headers["X-OK"] = "ok";
            console.log("==> ALLOWED");
            console.log(event.headers);
            return generateAuthResponse('user', 'Allow', methodArn);
        default:
            console.log("==> DENIED");
            console.log(event.headers);
            return generateAuthResponse('user', 'Deny', methodArn);
    }
}

function generateAuthResponse(principalId, effect, methodArn) {
    const policyDocument = generatePolicyDocument(effect, methodArn);
    const context = {
        "value1": "123",
    };

    const res = {
        principalId: principalId,
        policyDocument: policyDocument,
        // context
    };
    console.log(res);
    console.log(policyDocument);

    return res;
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };

    return policyDocument;
}
