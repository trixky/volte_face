var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (type === "application/octet-stream") {
        return fulfil(data);
      }
      const encoding = h["content-encoding"] || "utf-8";
      fulfil(new TextDecoder(encoding).decode(data));
    });
  });
}

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error3;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response2 = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response2(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response2(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response2.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response2(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response2(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response2(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response2(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
globalThis.fetch = fetch2;
globalThis.Response = Response2;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    return body2 ? `<script type="svelte-data" url="${url}" body="${hash(body2)}">${json}<\/script>` : `<script type="svelte-data" url="${url}">${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          response = await fetch(url, opts);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new Response(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await fetch(`http://${page.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = { ...opts.headers };
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new Response(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page
    });
  } catch (error4) {
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({ ...request, params });
    if (response) {
      if (typeof response !== "object") {
        return error(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers = {} } = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json")) {
        headers = { ...headers, "content-type": "application/json" };
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers };
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// node_modules/svelte/internal/index.mjs
function noop2() {
}
function assign(tar, src2) {
  for (const k in src2)
    tar[k] = src2[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal2(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// node_modules/svelte/easing/index.mjs
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function quintOut(t) {
  return --t * t * t * t * t + 1;
}

// node_modules/svelte/transition/index.mjs
function __rest(s2, e) {
  var t = {};
  for (var p in s2)
    if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0)
      t[p] = s2[p];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s2); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i]))
        t[p[i]] = s2[p[i]];
    }
  return t;
}
function crossfade(_a) {
  var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
  const to_receive = new Map();
  const to_send = new Map();
  function crossfade2(from, node, params) {
    const { delay = 0, duration = (d2) => Math.sqrt(d2) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
    const to = node.getBoundingClientRect();
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const dw = from.width / to.width;
    const dh = from.height / to.height;
    const d = Math.sqrt(dx * dx + dy * dy);
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;
    const opacity = +style.opacity;
    return {
      delay,
      duration: is_function(duration) ? duration(d) : duration,
      easing,
      css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
    };
  }
  function transition(items, counterparts, intro) {
    return (node, params) => {
      items.set(params.key, {
        rect: node.getBoundingClientRect()
      });
      return () => {
        if (counterparts.has(params.key)) {
          const { rect } = counterparts.get(params.key);
          counterparts.delete(params.key);
          return crossfade2(rect, node, params);
        }
        items.delete(params.key);
        return fallback && fallback(node, params, intro);
      };
    };
  }
  return [
    transition(to_send, to_receive, false),
    transition(to_receive, to_send, true)
  ];
}

// node_modules/svelte/store/index.mjs
var subscriber_queue2 = [];
function writable2(value, start = noop2) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal2(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue2.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue2.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue2.length; i += 2) {
            subscriber_queue2[i][0](subscriber_queue2[i + 1]);
          }
          subscriber_queue2.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop2) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop2;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}

// .svelte-kit/output/server/app.js
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$9);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-1j55zn5"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n\n<head>\n	<meta charset="utf-8" />\n	<link rel="icon" href="/favicon.png" />\n	<meta name="viewport" content="width=device-width, initial-scale=1" />\n	' + head + '\n</head>\n\n<body style="margin: 0; padding: 30px;">\n	<div id="svelte">' + body + "</div>\n</body>\n<style>\n	@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');\n	h1, h2, p, a {\n        font-family: 'Bungee', cursive;\n	}\n	.center {\n        text-align: center;\n    }\n</style>\n\n</html>";
var options = null;
function init(settings2) {
  set_paths(settings2.paths);
  set_prerendering(settings2.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-78666dcb.js",
      css: ["/./_app/assets/start-a8cd1609.css"],
      js: ["/./_app/start-78666dcb.js", "/./_app/chunks/vendor-ac44e151.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings2.paths,
    read: settings2.read,
    root: Root,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": "cpu.png", "size": 5059, "type": "image/png" }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "github.png", "size": 3162, "type": "image/png" }, { "file": "menu_selection.mp3", "size": 17412, "type": "audio/mpeg" }, { "file": "move.mp3", "size": 3433, "type": "audio/mpeg" }, { "file": "restart.svg", "size": 414, "type": "image/svg+xml" }, { "file": "svelte.png", "size": 4222, "type": "image/png" }, { "file": "two_players.png", "size": 2434, "type": "image/png" }, { "file": "vercel.png", "size": 4336, "type": "image/png" }],
  layout: ".svelte-kit/build/components/layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/settings\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/settings.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: [".svelte-kit/build/components/layout.svelte", "src/routes/about.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request))
});
var module_lookup = {
  ".svelte-kit/build/components/layout.svelte": () => Promise.resolve().then(function() {
    return layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/settings.svelte": () => Promise.resolve().then(function() {
    return settings;
  }),
  "src/routes/about.svelte": () => Promise.resolve().then(function() {
    return about;
  })
};
var metadata_lookup = { ".svelte-kit/build/components/layout.svelte": { "entry": "/./_app/layout.svelte-1f4844fd.js", "css": [], "js": ["/./_app/layout.svelte-1f4844fd.js", "/./_app/chunks/vendor-ac44e151.js"], "styles": null }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-5c716df4.js", "css": [], "js": ["/./_app/error.svelte-5c716df4.js", "/./_app/chunks/vendor-ac44e151.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-79e40a0b.js", "css": ["/./_app/assets/pages/index.svelte-bcb26473.css", "/./_app/assets/Header-8c038b0c.css"], "js": ["/./_app/pages/index.svelte-79e40a0b.js", "/./_app/chunks/vendor-ac44e151.js", "/./_app/chunks/Header-b182b7f8.js", "/./_app/chunks/cookies-473cfc31.js"], "styles": null }, "src/routes/settings.svelte": { "entry": "/./_app/pages/settings.svelte-17ed52c4.js", "css": ["/./_app/assets/pages/settings.svelte-1b04485a.css", "/./_app/assets/Header-8c038b0c.css"], "js": ["/./_app/pages/settings.svelte-17ed52c4.js", "/./_app/chunks/vendor-ac44e151.js", "/./_app/chunks/Header-b182b7f8.js", "/./_app/chunks/cookies-473cfc31.js"], "styles": null }, "src/routes/about.svelte": { "entry": "/./_app/pages/about.svelte-e8accbab.js", "css": ["/./_app/assets/pages/about.svelte-b9811563.css", "/./_app/assets/Header-8c038b0c.css"], "js": ["/./_app/pages/about.svelte-e8accbab.js", "/./_app/chunks/vendor-ac44e151.js", "/./_app/chunks/Header-b182b7f8.js"], "styles": null } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
init({ paths: { "base": "", "assets": "/." } });
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${slots.default ? slots.default({}) : ``}`;
});
var layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<p>${escape2(error22.message)}</p>


${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error2,
  load
});
function get_score(board) {
  let first_player_score = 0;
  let second_player_score = 0;
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      board[y][x] && (board[y][x] === 1 ? first_player_score++ : second_player_score++);
    }
  return [first_player_score, second_player_score];
}
var const_game = {
  players: {
    nobody: 0,
    first_player: 1,
    second_player: 2
  },
  themes: {
    green: 1,
    blue: 2,
    red: 3
  },
  themes_border: {
    without_border: false,
    with_border: true
  },
  sounds: {
    on: true,
    off: false
  },
  volume: {
    min: 0,
    max: 100,
    default: 30
  },
  bot_difficulty: {
    easy: 1,
    medium: 2,
    hard: 3
  },
  mode: {
    human: true,
    bot: false
  }
};
function get_initial_value$1() {
  return {
    first_player_to_play: const_game.players.first_player,
    theme: const_game.themes.blue,
    theme_border: const_game.themes_border.with_border,
    sounds: const_game.sounds.on,
    volume: const_game.volume.default,
    mode: const_game.mode.bot,
    bot_difficulty: const_game.bot_difficulty.medium
  };
}
function createGameStore$1() {
  const { subscribe: subscribe2, set, update } = writable2(get_initial_value$1());
  return {
    subscribe: subscribe2,
    update,
    update_first_player: (v) => update((s2) => ({ ...s2, first_player_to_play: v })),
    update_theme: (v) => update((s2) => ({ ...s2, theme: v })),
    update_theme_border: (v) => update((s2) => ({ ...s2, theme_border: v })),
    update_sounds: (v) => update((s2) => ({ ...s2, sounds: v })),
    update_volume: (v) => update((s2) => ({ ...s2, volume: v })),
    update_mode: (v) => update((s2) => ({ ...s2, mode: v })),
    update_bot_difficulty: (v) => update((s2) => ({ ...s2, bot_difficulty: v })),
    reset: () => set(get_initial_value$1()),
    set
  };
}
var store_settings = createGameStore$1();
function get_initial_value() {
  return {
    mode: const_game.mode.human,
    turn: get_store_value(store_settings).first_player_to_play,
    pawns: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  };
}
function createGameStore() {
  const { subscribe: subscribe2, set, update } = writable2(get_initial_value());
  return {
    subscribe: subscribe2,
    update,
    restart: () => set(get_initial_value())
  };
}
var store_game = createGameStore();
var css$8 = {
  code: "#title-container.svelte-59h06a{padding:10px 30px;width:320px;color:black;background-color:white;display:inline-block;border:4px solid black}#title-container.returned.svelte-59h06a{color:white;background-color:black}#title-container.animation-shaking.svelte-59h06a{animation:svelte-59h06a-shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both}#title-container.animation-to-not-returned.svelte-59h06a{animation:svelte-59h06a-rotation 300ms linear 0s 1 normal none}#title-container.animation-to-returned.svelte-59h06a{animation:svelte-59h06a-rotation 300ms linear 0s 1 reverse none}h1.svelte-59h06a{display:inline-block;font-size:50px;margin:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}@keyframes svelte-59h06a-shake{10%,90%{transform:translate3d(-1px, 0, 0)}20%,80%{transform:translate3d(2px, 0, 0)}30%,50%,70%{transform:translate3d(-4px, 0, 0)}40%,60%{transform:translate3d(4px, 0, 0)}}@keyframes svelte-59h06a-rotation{from{color:white;background-color:black;transform:matrix(1, 0, 0, 1, 0, 0)}49.9%{color:white;background-color:black}50%{color:black;background-color:white;transform:matrix(1, 0, 0, 0.01, 0, 0)}to{color:black;background-color:white;transform:matrix(1, 0, 0, 1, 0, 0)}}",
  map: '{"version":3,"file":"Title.svelte","sources":["Title.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script context=\\"module\\">\\n    let module_title_returned = false;\\n    let module_title_never_clicked = true;\\n    let module_title_never_shaked = true;\\n<\/script>\\n\\n<script>\\n    import { onMount } from \\"svelte\\";\\n    import { store_settings } from \\"../../stores/store.settings\\";\\n\\n    let title_never_clicked = true;\\n    let block_animation = false;\\n    let title_shaking = false;\\n    let title_returned = module_title_returned;\\n    let title_returned_wait_block_animation = title_returned;\\n\\n    $: module_title_returned = title_returned;\\n\\n    let sound_menu_selection = null;\\n\\n    onMount(() => (sound_menu_selection = new Audio(\\"/menu_selection.mp3\\")));\\n\\n    function play_menu_selection_sound(force_to_play = null) {\\n        if ($store_settings.sounds) {\\n            const new_sound = sound_menu_selection.cloneNode(true);\\n            new_sound.volume = $store_settings.volume / 100;\\n            new_sound.play();\\n        }\\n        return true;\\n    }\\n\\n    function titleRotationHandler() {\\n        play_menu_selection_sound();\\n        title_never_clicked = false;\\n        module_title_never_clicked = false;\\n        title_returned = !title_returned;\\n        block_animation = true;\\n        setTimeout(() => {\\n            block_animation = false;\\n            setTimeout(() => {\\n                title_returned_wait_block_animation = title_returned;\\n            }, 100);\\n        }, null);\\n    }\\n\\n    setTimeout(() => {\\n        if (module_title_never_shaked) {\\n            title_shaking = true;\\n            module_title_never_shaked = false;\\n        }\\n    }, 4000 + Math.random() * 4000);\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<div\\n    id=\\"title-container\\"\\n    class:animation-shaking={title_shaking}\\n    class:returned={title_returned_wait_block_animation}\\n    class:animation-to-returned={title_returned &&\\n        !block_animation &&\\n        !title_never_clicked}\\n    class:animation-to-not-returned={!title_returned &&\\n        !block_animation &&\\n        !title_never_clicked}\\n    on:click={titleRotationHandler}\\n>\\n    <h1>Volte Face</h1>\\n</div>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    #title-container {\\n        padding: 10px 30px;\\n        width: 320px;\\n        color: black;\\n        background-color: white;\\n        display: inline-block;\\n        border: 4px solid black;\\n    }\\n\\n    #title-container.returned {\\n        color: white;\\n        background-color: black;\\n    }\\n\\n    #title-container.animation-shaking {\\n        animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;\\n    }\\n\\n    #title-container.animation-to-not-returned {\\n        animation: rotation 300ms linear 0s 1 normal none;\\n    }\\n\\n    #title-container.animation-to-returned {\\n        animation: rotation 300ms linear 0s 1 reverse none;\\n    }\\n\\n    h1 {\\n        display: inline-block;\\n        font-size: 50px;\\n        margin: 0;\\n\\n        -webkit-user-select: none; /* Safari */\\n        -moz-user-select: none; /* Firefox */\\n        -ms-user-select: none; /* IE10+/Edge */\\n        user-select: none; /* Standard */\\n    }\\n\\n    @keyframes shake {\\n        10%,\\n        90% {\\n            transform: translate3d(-1px, 0, 0);\\n        }\\n\\n        20%,\\n        80% {\\n            transform: translate3d(2px, 0, 0);\\n        }\\n\\n        30%,\\n        50%,\\n        70% {\\n            transform: translate3d(-4px, 0, 0);\\n        }\\n\\n        40%,\\n        60% {\\n            transform: translate3d(4px, 0, 0);\\n        }\\n    }\\n\\n    @keyframes rotation {\\n        from {\\n            color: white;\\n            background-color: black;\\n            transform: matrix(1, 0, 0, 1, 0, 0);\\n        }\\n        49.9% {\\n            color: white;\\n            background-color: black;\\n        }\\n        50% {\\n            color: black;\\n            background-color: white;\\n            transform: matrix(1, 0, 0, 0.01, 0, 0);\\n        }\\n        to {\\n            color: black;\\n            background-color: white;\\n            transform: matrix(1, 0, 0, 1, 0, 0);\\n        }\\n    }\\n</style>\\n"],"names":[],"mappings":"AAwEI,gBAAgB,cAAC,CAAC,AACd,OAAO,CAAE,IAAI,CAAC,IAAI,CAClB,KAAK,CAAE,KAAK,CACZ,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,CACvB,OAAO,CAAE,YAAY,CACrB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,AAC3B,CAAC,AAED,gBAAgB,SAAS,cAAC,CAAC,AACvB,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,AAC3B,CAAC,AAED,gBAAgB,kBAAkB,cAAC,CAAC,AAChC,SAAS,CAAE,mBAAK,CAAC,KAAK,CAAC,aAAa,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,CAAC,CAAC,IAAI,AACpE,CAAC,AAED,gBAAgB,0BAA0B,cAAC,CAAC,AACxC,SAAS,CAAE,sBAAQ,CAAC,KAAK,CAAC,MAAM,CAAC,EAAE,CAAC,CAAC,CAAC,MAAM,CAAC,IAAI,AACrD,CAAC,AAED,gBAAgB,sBAAsB,cAAC,CAAC,AACpC,SAAS,CAAE,sBAAQ,CAAC,KAAK,CAAC,MAAM,CAAC,EAAE,CAAC,CAAC,CAAC,OAAO,CAAC,IAAI,AACtD,CAAC,AAED,EAAE,cAAC,CAAC,AACA,OAAO,CAAE,YAAY,CACrB,SAAS,CAAE,IAAI,CACf,MAAM,CAAE,CAAC,CAET,mBAAmB,CAAE,IAAI,CACzB,gBAAgB,CAAE,IAAI,CACtB,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,WAAW,mBAAM,CAAC,AACd,GAAG,CACH,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACtC,CAAC,AAED,GAAG,CACH,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,YAAY,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACrC,CAAC,AAED,GAAG,CACH,GAAG,CACH,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,YAAY,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACtC,CAAC,AAED,GAAG,CACH,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,YAAY,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACrC,CAAC,AACL,CAAC,AAED,WAAW,sBAAS,CAAC,AACjB,IAAI,AAAC,CAAC,AACF,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,CACvB,SAAS,CAAE,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACvC,CAAC,AACD,KAAK,AAAC,CAAC,AACH,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,AAC3B,CAAC,AACD,GAAG,AAAC,CAAC,AACD,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,CACvB,SAAS,CAAE,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAC1C,CAAC,AACD,EAAE,AAAC,CAAC,AACA,KAAK,CAAE,KAAK,CACZ,gBAAgB,CAAE,KAAK,CACvB,SAAS,CAAE,OAAO,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACvC,CAAC,AACL,CAAC"}'
};
var module_title_returned = false;
var module_title_never_shaked = true;
var Title = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_store_settings;
  $$unsubscribe_store_settings = subscribe(store_settings, (value) => value);
  let title_never_clicked = true;
  let block_animation = false;
  let title_shaking = false;
  let title_returned = module_title_returned;
  let title_returned_wait_block_animation = title_returned;
  onMount(() => new Audio("/menu_selection.mp3"));
  setTimeout(() => {
    if (module_title_never_shaked) {
      title_shaking = true;
      module_title_never_shaked = false;
    }
  }, 4e3 + Math.random() * 4e3);
  $$result.css.add(css$8);
  module_title_returned = title_returned;
  $$unsubscribe_store_settings();
  return `





<div id="${"title-container"}" class="${[
    "svelte-59h06a",
    (title_shaking ? "animation-shaking" : "") + " " + (title_returned_wait_block_animation ? "returned" : "") + " " + (title_returned && !block_animation && !title_never_clicked ? "animation-to-returned" : "") + " " + (!title_returned && !block_animation && !title_never_clicked ? "animation-to-not-returned" : "")
  ].join(" ").trim()}"><h1 class="${"svelte-59h06a"}">Volte Face</h1></div>

`;
});
var css$7 = {
  code: "#menu.svelte-f4s9s7{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}ul.svelte-f4s9s7{padding:0;list-style-type:none}li.svelte-f4s9s7{display:inline-block;padding:5px 15px;margin:0 5px;text-decoration:none}li.svelte-f4s9s7:hover{text-decoration:underline}a.svelte-f4s9s7{transform:scale(1.5);color:inherit;text-decoration:inherit}",
  map: '{"version":3,"file":"Navbar.svelte","sources":["Navbar.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import { onMount } from \\"svelte\\";\\n    import { store_settings } from \\"../../stores/store.settings\\";\\n\\n    let sound_menu_selection = null;\\n\\n    onMount(() => {\\n        sound_menu_selection = new Audio(\\"/menu_selection.mp3\\");\\n    });\\n\\n    function play_menu_selection_sound(force_to_play = null) {\\n        if (\\n            ($store_settings.sounds || force_to_play === true) &&\\n            force_to_play != false\\n        ) {\\n            const new_sound = sound_menu_selection.cloneNode(true);\\n            new_sound.volume = $store_settings.volume / 100;\\n            new_sound.play();\\n        }\\n        return true;\\n    }\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<nav id=\\"menu\\">\\n    <ul>\\n        <li><a on:click={play_menu_selection_sound} href=\\"/\\">Home</a></li>\\n        <li><a on:click={play_menu_selection_sound} href=\\"/settings\\">Settings</a></li>\\n        <li><a on:click={play_menu_selection_sound} href=\\"/about\\">About</a></li>\\n    </ul>\\n</nav>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    #menu {\\n        -webkit-user-select: none; /* Safari */\\n        -moz-user-select: none; /* Firefox */\\n        -ms-user-select: none; /* IE10+/Edge */\\n        user-select: none; /* Standard */\\n    }\\n\\n    ul {\\n        padding: 0;\\n        list-style-type: none;\\n    }\\n\\n    li {\\n        display: inline-block;\\n        padding: 5px 15px;\\n        margin: 0 5px;\\n        text-decoration: none;\\n    }\\n\\n    li:hover {\\n        text-decoration: underline;\\n    }\\n\\n    a {\\n        transform: scale(1.5);\\n        color: inherit;\\n        text-decoration: inherit;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAmCI,KAAK,cAAC,CAAC,AACH,mBAAmB,CAAE,IAAI,CACzB,gBAAgB,CAAE,IAAI,CACtB,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,EAAE,cAAC,CAAC,AACA,OAAO,CAAE,CAAC,CACV,eAAe,CAAE,IAAI,AACzB,CAAC,AAED,EAAE,cAAC,CAAC,AACA,OAAO,CAAE,YAAY,CACrB,OAAO,CAAE,GAAG,CAAC,IAAI,CACjB,MAAM,CAAE,CAAC,CAAC,GAAG,CACb,eAAe,CAAE,IAAI,AACzB,CAAC,AAED,gBAAE,MAAM,AAAC,CAAC,AACN,eAAe,CAAE,SAAS,AAC9B,CAAC,AAED,CAAC,cAAC,CAAC,AACC,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,KAAK,CAAE,OAAO,CACd,eAAe,CAAE,OAAO,AAC5B,CAAC"}'
};
var Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_store_settings;
  $$unsubscribe_store_settings = subscribe(store_settings, (value) => value);
  onMount(() => {
    new Audio("/menu_selection.mp3");
  });
  $$result.css.add(css$7);
  $$unsubscribe_store_settings();
  return `



<nav id="${"menu"}" class="${"svelte-f4s9s7"}"><ul class="${"svelte-f4s9s7"}"><li class="${"svelte-f4s9s7"}"><a href="${"/"}" class="${"svelte-f4s9s7"}">Home</a></li>
        <li class="${"svelte-f4s9s7"}"><a href="${"/settings"}" class="${"svelte-f4s9s7"}">Settings</a></li>
        <li class="${"svelte-f4s9s7"}"><a href="${"/about"}" class="${"svelte-f4s9s7"}">About</a></li></ul></nav>

`;
});
var css$6 = {
  code: "#header.svelte-w9pseg{margin-bottom:50px\n    }",
  map: '{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import Title from \\"./Title.svelte\\"\\n    import Navbar from \\"./Navbar.svelte\\"\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<div id=\\"header\\">\\n    <Title/>\\n    <Navbar/>\\n</div>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    #header {\\n        margin-bottom: 50px\\n    }\\n</style>"],"names":[],"mappings":"AAcI,OAAO,cAAC,CAAC,AACL,aAAa,CAAE,IAAI;IACvB,CAAC"}'
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `



<div id="${"header"}" class="${"svelte-w9pseg"}">${validate_component(Title, "Title").$$render($$result, {}, {}, {})}
    ${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}</div>

`;
});
var css$5 = {
  code: ".pawn.svelte-551jm7{display:block;position:absolute;margin:3px;width:44px;height:44px;border-radius:50%;border:solid;border-width:4px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box}.pawn_rotation_to_white.svelte-551jm7{animation-name:svelte-551jm7-rotation, svelte-551jm7-to_white;animation-duration:0.5s;animation-iteration-count:running;animation-timing-function:linear}.pawn_rotation_to_black.svelte-551jm7{animation-name:svelte-551jm7-rotation, svelte-551jm7-to_black;animation-duration:0.5s;animation-iteration-count:running;animation-timing-function:linear}.pawn_white.svelte-551jm7{background-color:#fff;border-color:#ccc}.pawn_black.svelte-551jm7{background-color:#444;border-color:#333}@keyframes svelte-551jm7-rotation{0%{transform:scale(1);top:0px;height:44px}20%{transform:scale(1.1);top:0px;height:44px}50%{top:22px;height:0px}80%{transform:scale(1.1);top:0px;height:44px}}@keyframes svelte-551jm7-to_black{from{background-color:#fff;border-color:#ccc}48%{background-color:#fff;border-color:#ccc}52%{background-color:#444;border-color:#333}}@keyframes svelte-551jm7-to_white{from{background-color:#444;border-color:#333}48%{background-color:#444;border-color:#333}52%{background-color:#fff;border-color:#ccc}}",
  map: '{"version":3,"file":"Pawn.svelte","sources":["Pawn.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n\\n<script>\\n    import { fade } from \\"svelte/transition\\";\\n    \\n    export let value = 1;\\n    export let rotation = false;\\n    let color = value;\\n\\n    $: if (value != color) setTimeout( _ => color = value, 100 )\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n\\n<div\\n    class=\\"pawn\\"\\n    class:pawn_rotation_to_white={rotation && value === 1}\\n    class:pawn_rotation_to_black={rotation && value === 2}\\n    class:pawn_white={color === 1}\\n    class:pawn_black={color === 2}\\n    transition:fade|local=\\"{{duration: 100}}\\"\\n    />\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n\\n<style>\\n    .pawn {\\n        display: block;\\n        position: absolute;\\n        margin: 3px;\\n        width: 44px;\\n        height: 44px;\\n        border-radius: 50%;\\n        border: solid;\\n        border-width: 4px;\\n\\n        box-sizing: border-box;\\n        -moz-box-sizing: border-box;\\n        -webkit-box-sizing: border-box;\\n    }\\n\\n    .pawn_rotation_to_white {\\n        animation-name: rotation, to_white;\\n        animation-duration: 0.5s;\\n        animation-iteration-count: running;\\n        animation-timing-function: linear;\\n    }\\n\\n    .pawn_rotation_to_black {\\n        animation-name: rotation, to_black;\\n        animation-duration: 0.5s;\\n        animation-iteration-count: running;\\n        animation-timing-function: linear;\\n    }\\n\\n    .pawn_white {\\n        background-color: #fff;\\n        border-color: #ccc;\\n    }\\n\\n    .pawn_black {\\n        background-color: #444;\\n        border-color: #333;\\n    }\\n\\n    @keyframes rotation {\\n        0% {\\n            transform: scale(1);\\n            top: 0px; \\n            height: 44px;\\n        }\\n        20% {\\n            transform: scale(1.1);\\n            top: 0px; \\n            height: 44px;\\n        }\\n        50%  { \\n            top: 22px; \\n            height: 0px;\\n        }\\n        80% {\\n            transform: scale(1.1);\\n            top: 0px; \\n            height: 44px;\\n        }\\n    }\\n\\n    @keyframes to_black {\\n        from { \\n            background-color: #fff;\\n            border-color: #ccc;\\n        }\\n        48%  { \\n            background-color: #fff;\\n            border-color: #ccc;\\n        }\\n        52%   { \\n            background-color: #444;\\n            border-color: #333;\\n        }\\n    }\\n\\n    @keyframes to_white {\\n        from { \\n            background-color: #444;\\n            border-color: #333;\\n        }\\n        48%  { \\n            background-color: #444;\\n            border-color: #333;\\n        }\\n        52%   { \\n            background-color: #fff;\\n            border-color: #ccc;\\n        }\\n    }\\n</style>"],"names":[],"mappings":"AA0BI,KAAK,cAAC,CAAC,AACH,OAAO,CAAE,KAAK,CACd,QAAQ,CAAE,QAAQ,CAClB,MAAM,CAAE,GAAG,CACX,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,aAAa,CAAE,GAAG,CAClB,MAAM,CAAE,KAAK,CACb,YAAY,CAAE,GAAG,CAEjB,UAAU,CAAE,UAAU,CACtB,eAAe,CAAE,UAAU,CAC3B,kBAAkB,CAAE,UAAU,AAClC,CAAC,AAED,uBAAuB,cAAC,CAAC,AACrB,cAAc,CAAE,sBAAQ,CAAC,CAAC,sBAAQ,CAClC,kBAAkB,CAAE,IAAI,CACxB,yBAAyB,CAAE,OAAO,CAClC,yBAAyB,CAAE,MAAM,AACrC,CAAC,AAED,uBAAuB,cAAC,CAAC,AACrB,cAAc,CAAE,sBAAQ,CAAC,CAAC,sBAAQ,CAClC,kBAAkB,CAAE,IAAI,CACxB,yBAAyB,CAAE,OAAO,CAClC,yBAAyB,CAAE,MAAM,AACrC,CAAC,AAED,WAAW,cAAC,CAAC,AACT,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,WAAW,cAAC,CAAC,AACT,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,WAAW,sBAAS,CAAC,AACjB,EAAE,AAAC,CAAC,AACA,SAAS,CAAE,MAAM,CAAC,CAAC,CACnB,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,AAChB,CAAC,AACD,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,AAChB,CAAC,AACD,GAAG,AAAE,CAAC,AACF,GAAG,CAAE,IAAI,CACT,MAAM,CAAE,GAAG,AACf,CAAC,AACD,GAAG,AAAC,CAAC,AACD,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,GAAG,CAAE,GAAG,CACR,MAAM,CAAE,IAAI,AAChB,CAAC,AACL,CAAC,AAED,WAAW,sBAAS,CAAC,AACjB,IAAI,AAAC,CAAC,AACF,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACD,GAAG,AAAE,CAAC,AACF,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACD,GAAG,AAAG,CAAC,AACH,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACL,CAAC,AAED,WAAW,sBAAS,CAAC,AACjB,IAAI,AAAC,CAAC,AACF,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACD,GAAG,AAAE,CAAC,AACF,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACD,GAAG,AAAG,CAAC,AACH,gBAAgB,CAAE,IAAI,CACtB,YAAY,CAAE,IAAI,AACtB,CAAC,AACL,CAAC"}'
};
var Pawn = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { value = 1 } = $$props;
  let { rotation = false } = $$props;
  let color = value;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.rotation === void 0 && $$bindings.rotation && rotation !== void 0)
    $$bindings.rotation(rotation);
  $$result.css.add(css$5);
  {
    if (value != color)
      setTimeout((_) => color = value, 100);
  }
  return `





<div class="${[
    "pawn svelte-551jm7",
    (rotation && value === 1 ? "pawn_rotation_to_white" : "") + " " + (rotation && value === 2 ? "pawn_rotation_to_black" : "") + " " + (color === 1 ? "pawn_white" : "") + " " + (color === 2 ? "pawn_black" : "")
  ].join(" ").trim()}"></div>

`;
});
var css$4 = {
  code: ".board-case.svelte-13ezf69{position:relative;display:inline-block;width:50px;height:50px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.board-case.theme-blue.svelte-13ezf69{background-color:rgb(181, 244, 255);border-color:rgb(0, 140, 255)}.board-case.theme-green.svelte-13ezf69{background-color:rgb(203, 255, 210);border-color:rgb(52, 194, 33)}.board-case.theme-red.svelte-13ezf69{background-color:rgb(255, 202, 202);border-color:rgb(255, 85, 85)}.board-case.svelte-13ezf69:not(.with-border){border-color:white\n    }.board-case-border-top.svelte-13ezf69{border-top:2.5px solid}.board-case-border-right.svelte-13ezf69{border-right:2.5px solid}.board-case-border-bottom.svelte-13ezf69{border-bottom:2.5px solid}.board-case-border-left.svelte-13ezf69{border-left:2.5px solid}",
  map: '{"version":3,"file":"Case.svelte","sources":["Case.svelte"],"sourcesContent":["<script>\\n    import Pawn from \\"./Pawn.svelte\\";\\n    import { store_settings } from \\"../../stores/store.settings\\";\\n    import { const_game } from \\"../../constants/const.game\\";\\n\\n    export let value;\\n    export let clickTrigger;\\n    export let borders = [false, false, false, false];\\n\\n    let local_value = value;\\n    let rotation = false;\\n\\n    $: if (value != local_value) {\\n        if (value != 0) {\\n            if (local_value) {\\n                rotation = false;\\n                setTimeout(() => (rotation = true), null);\\n            }\\n        } else {\\n            rotation = false;\\n        }\\n        local_value = value;\\n    }\\n<\/script>\\n\\n<div\\n    class=\\"board-case green-theme\\"\\n    class:with-border={$store_settings.theme_border === const_game.themes_border.with_border}\\n    class:theme-blue={$store_settings.theme === const_game.themes.blue}\\n    class:theme-green={$store_settings.theme === const_game.themes.green}\\n    class:theme-red={$store_settings.theme === const_game.themes.red}\\n    class:board-case-border-top={borders[0]}\\n    class:board-case-border-right={borders[1]}\\n    class:board-case-border-bottom={borders[2]}\\n    class:board-case-border-left={borders[3]}\\n    on:click={clickTrigger}\\n>\\n    {#if local_value}\\n        <Pawn value={local_value} {rotation} />\\n    {/if}\\n    &nbsp;\\n</div>\\n\\n<style>\\n    .board-case {\\n        position: relative;\\n        display: inline-block;\\n        width: 50px;\\n        height: 50px;\\n\\n        -webkit-user-select: none; /* Safari */\\n        -moz-user-select: none; /* Firefox */\\n        -ms-user-select: none; /* IE10+/Edge */\\n        user-select: none; /* Standard */\\n    }\\n\\n    .board-case.theme-blue {\\n        background-color: rgb(181, 244, 255);\\n        border-color: rgb(0, 140, 255);\\n    }\\n\\n    .board-case.theme-green {\\n        background-color: rgb(203, 255, 210);\\n        border-color: rgb(52, 194, 33);\\n    }\\n\\n    .board-case.theme-red {\\n        background-color: rgb(255, 202, 202);\\n        border-color: rgb(255, 85, 85);\\n    }\\n\\n    .board-case:not(.with-border) {\\n        border-color: white\\n    }\\n\\n    .board-case-border-top {\\n        border-top: 2.5px solid;\\n    }\\n\\n    .board-case-border-right {\\n        border-right: 2.5px solid;\\n    }\\n\\n    .board-case-border-bottom {\\n        border-bottom: 2.5px solid;\\n    }\\n\\n    .board-case-border-left {\\n        border-left: 2.5px solid;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA4CI,WAAW,eAAC,CAAC,AACT,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,CACrB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CAEZ,mBAAmB,CAAE,IAAI,CACzB,gBAAgB,CAAE,IAAI,CACtB,eAAe,CAAE,IAAI,CACrB,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,WAAW,WAAW,eAAC,CAAC,AACpB,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,YAAY,CAAE,IAAI,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AAClC,CAAC,AAED,WAAW,YAAY,eAAC,CAAC,AACrB,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,YAAY,CAAE,IAAI,EAAE,CAAC,CAAC,GAAG,CAAC,CAAC,EAAE,CAAC,AAClC,CAAC,AAED,WAAW,UAAU,eAAC,CAAC,AACnB,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,CACpC,YAAY,CAAE,IAAI,GAAG,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AAClC,CAAC,AAED,0BAAW,KAAK,YAAY,CAAC,AAAC,CAAC,AAC3B,YAAY,CAAE,KAAK;IACvB,CAAC,AAED,sBAAsB,eAAC,CAAC,AACpB,UAAU,CAAE,KAAK,CAAC,KAAK,AAC3B,CAAC,AAED,wBAAwB,eAAC,CAAC,AACtB,YAAY,CAAE,KAAK,CAAC,KAAK,AAC7B,CAAC,AAED,yBAAyB,eAAC,CAAC,AACvB,aAAa,CAAE,KAAK,CAAC,KAAK,AAC9B,CAAC,AAED,uBAAuB,eAAC,CAAC,AACrB,WAAW,CAAE,KAAK,CAAC,KAAK,AAC5B,CAAC"}'
};
var Case = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store_settings, $$unsubscribe_store_settings;
  $$unsubscribe_store_settings = subscribe(store_settings, (value2) => $store_settings = value2);
  let { value } = $$props;
  let { clickTrigger } = $$props;
  let { borders = [false, false, false, false] } = $$props;
  let local_value = value;
  let rotation = false;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.clickTrigger === void 0 && $$bindings.clickTrigger && clickTrigger !== void 0)
    $$bindings.clickTrigger(clickTrigger);
  if ($$props.borders === void 0 && $$bindings.borders && borders !== void 0)
    $$bindings.borders(borders);
  $$result.css.add(css$4);
  {
    if (value != local_value) {
      if (value != 0) {
        if (local_value) {
          rotation = false;
          setTimeout(() => rotation = true, null);
        }
      } else {
        rotation = false;
      }
      local_value = value;
    }
  }
  $$unsubscribe_store_settings();
  return `<div class="${[
    "board-case green-theme svelte-13ezf69",
    ($store_settings.theme_border === const_game.themes_border.with_border ? "with-border" : "") + " " + ($store_settings.theme === const_game.themes.blue ? "theme-blue" : "") + " " + ($store_settings.theme === const_game.themes.green ? "theme-green" : "") + " " + ($store_settings.theme === const_game.themes.red ? "theme-red" : "") + " " + (borders[0] ? "board-case-border-top" : "") + " " + (borders[1] ? "board-case-border-right" : "") + " " + (borders[2] ? "board-case-border-bottom" : "") + " " + (borders[3] ? "board-case-border-left" : "")
  ].join(" ").trim()}">${local_value ? `${validate_component(Pawn, "Pawn").$$render($$result, { value: local_value, rotation }, {}, {})}` : ``}
    \xA0
</div>`;
});
function next_board(board, player, x, y) {
  let new_player = player;
  let board_changed = false;
  const new_board = [...board];
  if (!board[y][x])
    for (let x_direction = -1; x_direction < 2; x_direction++)
      for (let y_direction = -1; y_direction < 2; y_direction++) {
        if ((x_direction || y_direction) && check_line(player, x, y, x_direction, y_direction, new_board, true)) {
          new_player = player === 1 ? 2 : 1;
          board_changed = true;
        }
      }
  let [first_player_is_blocked, second_player_is_blocked] = is_player_blocked(new_board);
  if (first_player_is_blocked && second_player_is_blocked)
    new_player = 0;
  else if (new_player === 1 && first_player_is_blocked)
    new_player = 2;
  else if (new_player === 2 && second_player_is_blocked)
    new_player = 1;
  return [new_board, new_player, board_changed];
}
function find_next_bot_move(board, difficulty) {
  const moves = [];
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      if (!board[y][x]) {
        let new_pawns = 1;
        for (let x_direction = -1; x_direction < 2; x_direction++)
          for (let y_direction = -1; y_direction < 2; y_direction++) {
            if (x_direction || y_direction) {
              new_pawns += check_line(const_game.players.second_player, x, y, x_direction, y_direction, board, false);
            }
          }
        if (new_pawns > 1)
          moves.push({ x, y, new_pawns });
      }
  const sorted_moves = moves.sort((a, b) => a.new_pawns > b.new_pawns);
  switch (difficulty) {
    case const_game.bot_difficulty.easy:
      return sorted_moves[Math.ceil(sorted_moves.length * (Math.random() * 0.3))] || sorted_moves[0];
    case const_game.bot_difficulty.medium:
      return sorted_moves[Math.round(sorted_moves.length * (Math.random() * 0.4 + 0.3))] || sorted_moves[0];
    case const_game.bot_difficulty.hard:
      return sorted_moves[Math.ceil(sorted_moves.length * (Math.random() * 0.3 + 0.7))] || sorted_moves[sorted_moves.length - 1];
  }
}
function is_player_blocked(board) {
  let first_player_is_blocked = true;
  let second_player_is_blocked = true;
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      if (!board[y][x])
        for (let x_direction = -1; x_direction < 2; x_direction++)
          for (let y_direction = -1; y_direction < 2; y_direction++) {
            if (x_direction || y_direction) {
              if (first_player_is_blocked)
                first_player_is_blocked = !check_line(1, x, y, x_direction, y_direction, board, false);
              if (second_player_is_blocked)
                second_player_is_blocked = !check_line(2, x, y, x_direction, y_direction, board, false);
            }
          }
    }
  return [first_player_is_blocked, second_player_is_blocked];
}
function check_line(player, x_pos, y_pos, x_direction, y_direction, board, modification) {
  const to_change = [];
  let next = 0;
  const initial_x_pos = x_pos;
  const initial_y_pos = y_pos;
  const x_limit_checker = x_direction ? x_direction > 0 ? (x) => x < 8 : (x) => x > -1 : (_) => true;
  const y_limit_checker = y_direction ? y_direction > 0 ? (y) => y < 8 : (y) => y > -1 : (_) => true;
  while (y_limit_checker(y_pos += y_direction) && x_limit_checker(x_pos += x_direction) && board[y_pos][x_pos] != player && board[y_pos][x_pos])
    to_change.push([x_pos, y_pos]);
  if (y_limit_checker(y_pos) && x_limit_checker(x_pos) && board[y_pos][x_pos] === player && to_change.length) {
    next += to_change.length;
    if (modification) {
      board[initial_y_pos][initial_x_pos] = player;
      to_change.forEach((case_to_change) => board[case_to_change[1]][case_to_change[0]] = player);
    }
  }
  return next;
}
var css$3 = {
  code: "#board-container.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{position:relative}#board.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{position:relative;display:inline-block;margin:15px 0;transition:opacity 2s}#board.with-border.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{border:solid;border-width:10px}#board.theme-blue.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{border-color:rgb(181, 244, 255)}#board.theme-green.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{border-color:rgb(203, 255, 210)}#board.theme-red.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{border-color:rgb(255, 202, 202)}.board-disabled.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{opacity:0.05}#gamer-over-title.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{z-index:10;position:absolute;top:100px;left:0;right:0}.gamer-over-title-white.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{color:white;font-size:30px;-webkit-text-stroke:1px black}.board-line.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{display:block;padding:0;margin:0}#board-buttons-container.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{height:100px}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m.svelte-w1sa1m{margin:3px 10px}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m.svelte-w1sa1m{background-color:#e9e9e9;border:none;width:55px;height:55px;transition:transform 0.2s}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m.svelte-w1sa1m:active{background-color:#ccc}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m>img.svelte-w1sa1m{transition:transform 0.4s}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m:first-child:hover>img.svelte-w1sa1m{transform:rotate(180deg)}#board-buttons-container.svelte-w1sa1m>button.svelte-w1sa1m:nth-child(2):hover>img.svelte-w1sa1m{transform:matrix(-1, 0, 0, 1, 0, 0)}img.svelte-w1sa1m.svelte-w1sa1m.svelte-w1sa1m{vertical-align:middle}",
  map: '{"version":3,"file":"Board.svelte","sources":["Board.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import { afterUpdate, onMount } from \\"svelte\\";\\n    import { fade } from \\"svelte/transition\\";\\n    import Case from \\"./Case.svelte\\";\\n    import { next_board, find_next_bot_move } from \\"../../logic/next_board\\";\\n    import { store_game } from \\"../../stores/store.game\\";\\n    import { get_score } from \\"../../logic/score\\";\\n    import { store_settings } from \\"../../stores/store.settings\\";\\n    import { const_game } from \\"../../constants/const.game\\";\\n\\n    let is_unmounted = false;\\n    let settings_mounted = false;\\n    let sound_move = null;\\n    let sound_menu_selection = null;\\n    let board_is_intact = true;\\n\\n    afterUpdate(() => {\\n        if (\\n            board_is_intact &&\\n            $store_settings.mode === const_game.mode.bot &&\\n            $store_game.turn === const_game.players.second_player\\n        )\\n            bot_play();\\n    });\\n\\n    onMount(() => {\\n        sound_move = new Audio(\\"/move.mp3\\");\\n        sound_menu_selection = new Audio(\\"/menu_selection.mp3\\");\\n        settings_mounted = true;\\n    });\\n\\n    function play_move_sound() {\\n        if ($store_settings.sounds) {\\n            setTimeout(() => {\\n                const new_sound = sound_move.cloneNode(true);\\n                new_sound.volume = $store_settings.volume / 100;\\n                new_sound.play();\\n            }, Math.random() * 50);\\n        }\\n        return true;\\n    }\\n\\n    function play_menu_selection_sound(force_to_play = null) {\\n        if (\\n            ($store_settings.sounds || force_to_play === true) &&\\n            force_to_play != false\\n        ) {\\n            const new_sound = sound_menu_selection.cloneNode(true);\\n            new_sound.volume = $store_settings.volume / 100;\\n            new_sound.play();\\n        }\\n        return true;\\n    }\\n\\n    let button_description = \\"\\";\\n\\n    function bot_play() {\\n        if (\\n            $store_settings.mode === const_game.mode.bot &&\\n            $store_game.turn === const_game.players.second_player\\n        )\\n            setTimeout(() => {\\n                if (!is_unmounted) {\\n                    const next_bot_move = find_next_bot_move(\\n                        $store_game.pawns,\\n                        $store_settings.bot_difficulty\\n                    );\\n                    handleClickTrigger(next_bot_move.x, next_bot_move.y, true);\\n                }\\n            }, 1234);\\n    }\\n\\n    function handleClickTrigger(x, y, from_bot = false) {\\n        if (\\n            $store_game.turn &&\\n            ($store_settings.mode === const_game.mode.human ||\\n                $store_game.turn === const_game.players.first_player ||\\n                from_bot)\\n        ) {\\n            const [new_pawns, new_turn, board_changed] = next_board(\\n                $store_game.pawns,\\n                $store_game.turn,\\n                x,\\n                y\\n            );\\n            if (board_changed) {\\n                play_move_sound();\\n                board_is_intact = false;\\n            }\\n\\n            store_game.update((n) => ({ ...n, pawns: new_pawns }));\\n            store_game.update((n) => ({ ...n, turn: new_turn }));\\n\\n            bot_play();\\n        }\\n    }\\n\\n    function restart_game() {\\n        store_game.restart();\\n        board_is_intact = true;\\n    }\\n\\n    $: [first_player_score, second_player_score] = get_score($store_game.pawns);\\n\\n    $: gamer_over_title =\\n        first_player_score === second_player_score\\n            ? `equality !<br/>${first_player_score} - ${second_player_score}`\\n            : first_player_score > second_player_score\\n            ? `player &nbsp;1&nbsp; (white)<br />win !<br /><br />${first_player_score} - ${second_player_score}`\\n            : `player &nbsp;2&nbsp; (black)<br />win !<br /><br />${second_player_score} - ${first_player_score}`;\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<div id=\\"board-container\\">\\n    {#if !$store_game.turn}\\n        <h2\\n            id=\\"gamer-over-title\\"\\n            class:gamer-over-title-white={first_player_score >\\n                second_player_score}\\n            class:gamer-over-title-black={first_player_score >\\n                second_player_score}\\n            transition:fade|local={{ duration: 500 }}\\n        >\\n            {@html gamer_over_title}\\n        </h2>\\n    {/if}\\n    <div\\n        id=\\"board\\"\\n        class:with-border={$store_settings.theme_border ===\\n            const_game.themes_border.with_border}\\n        class:board-disabled={!$store_game.turn}\\n        class:theme-blue={$store_settings.theme === const_game.themes.blue}\\n        class:theme-green={$store_settings.theme === const_game.themes.green}\\n        class:theme-red={$store_settings.theme === const_game.themes.red}\\n    >\\n        {#each $store_game.pawns as line, y}\\n            <div class=\\"board-line\\">\\n                {#each line as value, x}\\n                    <Case\\n                        {value}\\n                        clickTrigger={() => handleClickTrigger(x, y)}\\n                        borders={[y != 0, x != 7, y != 7, x != 0]}\\n                    />\\n                {/each}\\n            </div>\\n        {/each}\\n    </div>\\n    <div id=\\"board-buttons-container\\">\\n        <button\\n            on:click={() => play_menu_selection_sound() && restart_game()}\\n            on:mouseenter={() => (button_description = \\"restart the game\\")}\\n            on:mouseleave={() => (button_description = \\"\\")}\\n        >\\n            <img\\n                id=\\"restart-icon\\"\\n                src=\\"/restart.svg\\"\\n                alt=\\"restart icon\\"\\n                width=\\"37px\\"\\n            />\\n        </button>\\n        <button\\n            on:click={() => {\\n                play_menu_selection_sound();\\n                if ($store_settings.mode === const_game.mode.human) {\\n                    store_settings.update_mode(const_game.mode.bot);\\n                    button_description = \\"human &nbsp;vs&nbsp; human\\";\\n                } else {\\n                    store_settings.update_mode(const_game.mode.human);\\n                    button_description = \\"human &nbsp;vs&nbsp; bot\\";\\n                }\\n                restart_game();\\n            }}\\n            on:mouseenter={() =>\\n                (button_description =\\n                    $store_settings.mode === const_game.mode.human\\n                        ? \\"human &nbsp;vs&nbsp; bot\\"\\n                        : \\"human &nbsp;vs&nbsp; human\\")}\\n            on:mouseleave={() => (button_description = \\"\\")}\\n        >\\n            <img\\n                src={$store_settings.mode === const_game.mode.human\\n                    ? \\"/cpu.png\\"\\n                    : \\"/two_players.png\\"}\\n                alt={$store_settings.mode === const_game.mode.human\\n                    ? \\"bot icon\\"\\n                    : \\"multiplayer icon\\"}\\n                width=\\"30px\\"\\n            />\\n        </button>\\n        {#if button_description}\\n            <p transition:fade|local={{ duration: 300 }}>\\n                {@html button_description}\\n            </p>\\n        {/if}\\n    </div>\\n</div>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    #board-container {\\n        position: relative;\\n    }\\n\\n    #board {\\n        position: relative;\\n        display: inline-block;\\n        margin: 15px 0;\\n        transition: opacity 2s;\\n    }\\n\\n    #board.with-border {\\n        border: solid;\\n        border-width: 10px;\\n    }\\n\\n    #board.theme-blue {\\n        border-color: rgb(181, 244, 255);\\n    }\\n\\n    #board.theme-green {\\n        border-color: rgb(203, 255, 210);\\n    }\\n\\n    #board.theme-red {\\n        border-color: rgb(255, 202, 202);\\n    }\\n\\n    .board-disabled {\\n        opacity: 0.05;\\n    }\\n\\n    #gamer-over-title {\\n        z-index: 10;\\n        position: absolute;\\n        top: 100px;\\n        left: 0;\\n        right: 0;\\n    }\\n\\n    .gamer-over-title-white {\\n        color: white;\\n        font-size: 30px;\\n        -webkit-text-stroke: 1px black;\\n    }\\n\\n    .board-line {\\n        display: block;\\n        padding: 0;\\n        margin: 0;\\n    }\\n\\n    #board-buttons-container {\\n        height: 100px;\\n    }\\n\\n    #board-buttons-container > button {\\n        margin: 3px 10px;\\n    }\\n\\n    #board-buttons-container > button {\\n        background-color: #e9e9e9;\\n        border: none;\\n        width: 55px;\\n        height: 55px;\\n        transition: transform 0.2s;\\n    }\\n\\n    #board-buttons-container > button:active {\\n        background-color: #ccc;\\n    }\\n\\n    #board-buttons-container > button > img {\\n        transition: transform 0.4s;\\n    }\\n\\n    #board-buttons-container > button:first-child:hover > img {\\n        transform: rotate(180deg);\\n    }\\n\\n    #board-buttons-container > button:nth-child(2):hover > img {\\n        transform: matrix(-1, 0, 0, 1, 0, 0);\\n    }\\n\\n    img {\\n        vertical-align: middle;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAwMI,gBAAgB,0CAAC,CAAC,AACd,QAAQ,CAAE,QAAQ,AACtB,CAAC,AAED,MAAM,0CAAC,CAAC,AACJ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,CACrB,MAAM,CAAE,IAAI,CAAC,CAAC,CACd,UAAU,CAAE,OAAO,CAAC,EAAE,AAC1B,CAAC,AAED,MAAM,YAAY,0CAAC,CAAC,AAChB,MAAM,CAAE,KAAK,CACb,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,MAAM,WAAW,0CAAC,CAAC,AACf,YAAY,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACpC,CAAC,AAED,MAAM,YAAY,0CAAC,CAAC,AAChB,YAAY,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACpC,CAAC,AAED,MAAM,UAAU,0CAAC,CAAC,AACd,YAAY,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACpC,CAAC,AAED,eAAe,0CAAC,CAAC,AACb,OAAO,CAAE,IAAI,AACjB,CAAC,AAED,iBAAiB,0CAAC,CAAC,AACf,OAAO,CAAE,EAAE,CACX,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,KAAK,CACV,IAAI,CAAE,CAAC,CACP,KAAK,CAAE,CAAC,AACZ,CAAC,AAED,uBAAuB,0CAAC,CAAC,AACrB,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,IAAI,CACf,mBAAmB,CAAE,GAAG,CAAC,KAAK,AAClC,CAAC,AAED,WAAW,0CAAC,CAAC,AACT,OAAO,CAAE,KAAK,CACd,OAAO,CAAE,CAAC,CACV,MAAM,CAAE,CAAC,AACb,CAAC,AAED,wBAAwB,0CAAC,CAAC,AACtB,MAAM,CAAE,KAAK,AACjB,CAAC,AAED,sCAAwB,CAAG,MAAM,4BAAC,CAAC,AAC/B,MAAM,CAAE,GAAG,CAAC,IAAI,AACpB,CAAC,AAED,sCAAwB,CAAG,MAAM,4BAAC,CAAC,AAC/B,gBAAgB,CAAE,OAAO,CACzB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,SAAS,CAAC,IAAI,AAC9B,CAAC,AAED,sCAAwB,CAAG,kCAAM,OAAO,AAAC,CAAC,AACtC,gBAAgB,CAAE,IAAI,AAC1B,CAAC,AAED,sCAAwB,CAAG,oBAAM,CAAG,GAAG,cAAC,CAAC,AACrC,UAAU,CAAE,SAAS,CAAC,IAAI,AAC9B,CAAC,AAED,sCAAwB,CAAG,oBAAM,YAAY,MAAM,CAAG,GAAG,cAAC,CAAC,AACvD,SAAS,CAAE,OAAO,MAAM,CAAC,AAC7B,CAAC,AAED,sCAAwB,CAAG,oBAAM,WAAW,CAAC,CAAC,MAAM,CAAG,GAAG,cAAC,CAAC,AACxD,SAAS,CAAE,OAAO,EAAE,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AACxC,CAAC,AAED,GAAG,0CAAC,CAAC,AACD,cAAc,CAAE,MAAM,AAC1B,CAAC"}'
};
var Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let first_player_score;
  let second_player_score;
  let gamer_over_title;
  let $store_settings, $$unsubscribe_store_settings;
  let $store_game, $$unsubscribe_store_game;
  $$unsubscribe_store_settings = subscribe(store_settings, (value) => $store_settings = value);
  $$unsubscribe_store_game = subscribe(store_game, (value) => $store_game = value);
  let sound_move = null;
  let board_is_intact = true;
  afterUpdate(() => {
    if (board_is_intact && $store_settings.mode === const_game.mode.bot && $store_game.turn === const_game.players.second_player)
      bot_play();
  });
  onMount(() => {
    sound_move = new Audio("/move.mp3");
    new Audio("/menu_selection.mp3");
  });
  function play_move_sound() {
    if ($store_settings.sounds) {
      setTimeout(() => {
        const new_sound = sound_move.cloneNode(true);
        new_sound.volume = $store_settings.volume / 100;
        new_sound.play();
      }, Math.random() * 50);
    }
    return true;
  }
  function bot_play() {
    if ($store_settings.mode === const_game.mode.bot && $store_game.turn === const_game.players.second_player)
      setTimeout(() => {
        {
          const next_bot_move = find_next_bot_move($store_game.pawns, $store_settings.bot_difficulty);
          handleClickTrigger(next_bot_move.x, next_bot_move.y, true);
        }
      }, 1234);
  }
  function handleClickTrigger(x, y, from_bot = false) {
    if ($store_game.turn && ($store_settings.mode === const_game.mode.human || $store_game.turn === const_game.players.first_player || from_bot)) {
      const [new_pawns, new_turn, board_changed] = next_board($store_game.pawns, $store_game.turn, x, y);
      if (board_changed) {
        play_move_sound();
        board_is_intact = false;
      }
      store_game.update((n) => ({ ...n, pawns: new_pawns }));
      store_game.update((n) => ({ ...n, turn: new_turn }));
      bot_play();
    }
  }
  $$result.css.add(css$3);
  [first_player_score, second_player_score] = get_score($store_game.pawns);
  gamer_over_title = first_player_score === second_player_score ? `equality !<br/>${first_player_score} - ${second_player_score}` : first_player_score > second_player_score ? `player &nbsp;1&nbsp; (white)<br />win !<br /><br />${first_player_score} - ${second_player_score}` : `player &nbsp;2&nbsp; (black)<br />win !<br /><br />${second_player_score} - ${first_player_score}`;
  $$unsubscribe_store_settings();
  $$unsubscribe_store_game();
  return `



<div id="${"board-container"}" class="${"svelte-w1sa1m"}">${!$store_game.turn ? `<h2 id="${"gamer-over-title"}" class="${[
    "svelte-w1sa1m",
    (first_player_score > second_player_score ? "gamer-over-title-white" : "") + " " + (first_player_score > second_player_score ? "gamer-over-title-black" : "")
  ].join(" ").trim()}">${gamer_over_title}</h2>` : ``}
    <div id="${"board"}" class="${[
    "svelte-w1sa1m",
    ($store_settings.theme_border === const_game.themes_border.with_border ? "with-border" : "") + " " + (!$store_game.turn ? "board-disabled" : "") + " " + ($store_settings.theme === const_game.themes.blue ? "theme-blue" : "") + " " + ($store_settings.theme === const_game.themes.green ? "theme-green" : "") + " " + ($store_settings.theme === const_game.themes.red ? "theme-red" : "")
  ].join(" ").trim()}">${each($store_game.pawns, (line, y) => `<div class="${"board-line svelte-w1sa1m"}">${each(line, (value, x) => `${validate_component(Case, "Case").$$render($$result, {
    value,
    clickTrigger: () => handleClickTrigger(x, y),
    borders: [y != 0, x != 7, y != 7, x != 0]
  }, {}, {})}`)}
            </div>`)}</div>
    <div id="${"board-buttons-container"}" class="${"svelte-w1sa1m"}"><button class="${"svelte-w1sa1m"}"><img id="${"restart-icon"}" src="${"/restart.svg"}" alt="${"restart icon"}" width="${"37px"}" class="${"svelte-w1sa1m"}"></button>
        <button class="${"svelte-w1sa1m"}"><img${add_attribute("src", $store_settings.mode === const_game.mode.human ? "/cpu.png" : "/two_players.png", 0)}${add_attribute("alt", $store_settings.mode === const_game.mode.human ? "bot icon" : "multiplayer icon", 0)} width="${"30px"}" class="${"svelte-w1sa1m"}"></button>
        ${``}</div></div>

`;
});
store_settings.subscribe((value) => {
});
function get_cookie(name) {
  return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}
function import_cookies() {
  const cookie_first_player_to_play = get_cookie("first_player_to_play");
  const cookie_theme = get_cookie("theme");
  const cookie_theme_border = get_cookie("theme_border");
  const cookie_sounds = get_cookie("sounds");
  const cookie_volume = get_cookie("volume");
  const cookie_mode = get_cookie("mode");
  const cookie_bot_difficulty = get_cookie("bot_difficulty");
  if (cookie_first_player_to_play)
    store_settings.update_first_player(parseInt(cookie_first_player_to_play));
  if (cookie_theme)
    store_settings.update_theme(parseInt(cookie_theme));
  if (cookie_theme_border === String(const_game.themes_border.with_border))
    store_settings.update_theme_border(const_game.themes_border.with_border);
  else if (cookie_theme_border === String(const_game.themes_border.without_border))
    store_settings.update_theme_border(const_game.themes_border.without_border);
  if (cookie_sounds === String(const_game.sounds.on))
    store_settings.update_sounds(const_game.sounds.on);
  else if (cookie_sounds === String(const_game.sounds.off))
    store_settings.update_sounds(const_game.sounds.off);
  if (cookie_volume)
    store_settings.update_volume(parseInt(cookie_volume));
  if (cookie_mode)
    store_settings.update_mode(parseInt(cookie_mode));
  if (cookie_bot_difficulty)
    store_settings.update_bot_difficulty(parseInt(cookie_bot_difficulty));
}
var css$2 = {
  code: "#player-infos-container.svelte-vvg15r.svelte-vvg15r{margin-bottom:20px}.player-infos.svelte-vvg15r.svelte-vvg15r{position:relative;display:inline-block;text-align:center;width:170px}.player-infos.svelte-vvg15r>p.svelte-vvg15r{text-align:center;margin:3px 0}.player-infos.svelte-vvg15r.svelte-vvg15r:first-child{margin-right:25px}.player-infos.svelte-vvg15r.svelte-vvg15r:last-child{margin-left:25px}.player-infos.svelte-vvg15r>div.svelte-vvg15r{position:absolute;top:-8px;left:-10px;height:calc(100% + 12px);width:calc(100% + 20px);z-index:-1;background-color:#e9e9e9;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import { quintOut } from \\"svelte/easing\\";\\n    import { crossfade } from \\"svelte/transition\\";\\n    import { get_score } from \\"../logic/score\\";\\n    import { store_game } from \\"../stores/store.game\\";\\n    import { store_settings } from \\"../stores/store.settings\\";\\n    import { const_game } from \\"../constants/const.game\\";\\n\\n    import Header from \\"../lib/header/Header.svelte\\";\\n    import Board from \\"../lib/gameboard/Board.svelte\\";\\n    import { onMount } from \\"svelte\\";\\n    import { import_cookies } from \\"../logic/cookies\\";\\n\\n    let settings_mounted = false;\\n\\n    onMount(() => {\\n        import_cookies();\\n        settings_mounted = true;\\n    });\\n\\n    const [send, receive] = crossfade({\\n        duration: (d) => Math.sqrt(d * 1000),\\n\\n        fallback(node, params) {\\n            const style = getComputedStyle(node);\\n            const transform = style.transform === \\"none\\" ? \\"\\" : style.transform;\\n\\n            return {\\n                duration: 1000,\\n                easing: quintOut,\\n                css: (t) => `\\n\\t\\t\\t\\t\\ttransform: ${transform} scale(${t});\\n\\t\\t\\t\\t\\topacity: ${t}\\n\\t\\t\\t\\t`,\\n            };\\n        },\\n    });\\n\\n    $: [first_player_score, second_player_score] = get_score($store_game.pawns);\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<header class=\\"center\\">\\n    <Header />\\n</header>\\n\\n<main class=\\"center\\">\\n    <div id=\\"player-infos-container\\">\\n        <div class=\\"player-infos\\">\\n            {#if $store_game.turn === 1}\\n                <div\\n                    in:receive|local={{ key: \\"todo.id\\" }}\\n                    out:send|local={{ key: \\"todo.id\\" }}\\n                />\\n            {/if}\\n            <p>\\n                player {@html $store_settings.mode === const_game.mode.human\\n                    ? \\"&nbsp;1\\"\\n                    : \\"\\"}&nbsp; (white)\\n            </p>\\n            <p>{first_player_score} &nbsp;pawns</p>\\n        </div>\\n        <div class=\\"player-infos\\">\\n            {#if $store_game.turn === 2}\\n                <div\\n                    in:receive|local={{ key: \\"todo.id\\" }}\\n                    out:send|local={{ key: \\"todo.id\\" }}\\n                />\\n            {/if}\\n            <p>\\n                {@html $store_settings.mode === const_game.mode.human\\n                    ? \\"player &nbsp;2\\"\\n                    : \\"bot \\"} &nbsp; (black)\\n            </p>\\n            <p>{second_player_score} &nbsp;pawns</p>\\n        </div>\\n    </div>\\n    {#if settings_mounted}\\n        <Board />\\n    {/if}\\n</main>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    #player-infos-container {\\n        margin-bottom: 20px;\\n    }\\n\\n    .player-infos {\\n        position: relative;\\n        display: inline-block;\\n        text-align: center;\\n        width: 170px;\\n    }\\n\\n    .player-infos > p {\\n        text-align: center;\\n        margin: 3px 0;\\n    }\\n\\n    .player-infos:first-child {\\n        margin-right: 25px;\\n    }\\n\\n    .player-infos:last-child {\\n        margin-left: 25px;\\n    }\\n\\n    .player-infos > div {\\n        position: absolute;\\n        top: -8px;\\n        left: -10px;\\n        height: calc(100% + 12px);\\n        width: calc(100% + 20px);\\n        z-index: -1;\\n        background-color: #e9e9e9;\\n\\n        box-sizing: border-box;\\n        -moz-box-sizing: border-box;\\n        -webkit-box-sizing: border-box;\\n    }\\n</style>\\n"],"names":[],"mappings":"AAqFI,uBAAuB,4BAAC,CAAC,AACrB,aAAa,CAAE,IAAI,AACvB,CAAC,AAED,aAAa,4BAAC,CAAC,AACX,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,CACrB,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,KAAK,AAChB,CAAC,AAED,2BAAa,CAAG,CAAC,cAAC,CAAC,AACf,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,GAAG,CAAC,CAAC,AACjB,CAAC,AAED,yCAAa,YAAY,AAAC,CAAC,AACvB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,yCAAa,WAAW,AAAC,CAAC,AACtB,WAAW,CAAE,IAAI,AACrB,CAAC,AAED,2BAAa,CAAG,GAAG,cAAC,CAAC,AACjB,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,IAAI,CACT,IAAI,CAAE,KAAK,CACX,MAAM,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CACzB,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,IAAI,CAAC,CACxB,OAAO,CAAE,EAAE,CACX,gBAAgB,CAAE,OAAO,CAEzB,UAAU,CAAE,UAAU,CACtB,eAAe,CAAE,UAAU,CAC3B,kBAAkB,CAAE,UAAU,AAClC,CAAC"}'
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let first_player_score;
  let second_player_score;
  let $store_game, $$unsubscribe_store_game;
  let $store_settings, $$unsubscribe_store_settings;
  $$unsubscribe_store_game = subscribe(store_game, (value) => $store_game = value);
  $$unsubscribe_store_settings = subscribe(store_settings, (value) => $store_settings = value);
  let settings_mounted = false;
  onMount(() => {
    import_cookies();
    settings_mounted = true;
  });
  crossfade({
    duration: (d) => Math.sqrt(d * 1e3),
    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === "none" ? "" : style.transform;
      return {
        duration: 1e3,
        easing: quintOut,
        css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
      };
    }
  });
  $$result.css.add(css$2);
  [first_player_score, second_player_score] = get_score($store_game.pawns);
  $$unsubscribe_store_game();
  $$unsubscribe_store_settings();
  return `



<header class="${"center"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}</header>

<main class="${"center"}"><div id="${"player-infos-container"}" class="${"svelte-vvg15r"}"><div class="${"player-infos svelte-vvg15r"}">${$store_game.turn === 1 ? `<div class="${"svelte-vvg15r"}"></div>` : ``}
            <p class="${"svelte-vvg15r"}">player ${$store_settings.mode === const_game.mode.human ? "&nbsp;1" : ""}\xA0 (white)
            </p>
            <p class="${"svelte-vvg15r"}">${escape2(first_player_score)} \xA0pawns</p></div>
        <div class="${"player-infos svelte-vvg15r"}">${$store_game.turn === 2 ? `<div class="${"svelte-vvg15r"}"></div>` : ``}
            <p class="${"svelte-vvg15r"}">${$store_settings.mode === const_game.mode.human ? "player &nbsp;2" : "bot "} \xA0 (black)
            </p>
            <p class="${"svelte-vvg15r"}">${escape2(second_player_score)} \xA0pawns</p></div></div>
    ${settings_mounted ? `${validate_component(Board, "Board").$$render($$result, {}, {}, {})}` : ``}</main>

`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
var css$1 = {
  code: ".options-line.svelte-17se8gf>button.svelte-17se8gf{display:inline-block;margin:0 5px 15px 10px;padding:0 15px;height:55px;width:90px;border:none;background-color:#e9e9e9;transition:opacity 0.2s}#option-blue.svelte-17se8gf.svelte-17se8gf{background-color:rgb(179, 244, 255)}#option-green.svelte-17se8gf.svelte-17se8gf{background-color:rgb(179, 255, 189)}#option-red.svelte-17se8gf.svelte-17se8gf{background-color:rgb(255, 179, 179)}.options-line.svelte-17se8gf>button.svelte-17se8gf:not(.option-selected){opacity:0.4}.slider.svelte-17se8gf.svelte-17se8gf{-webkit-appearance:none;width:240px;height:20px;outline:none;border:solid 3px #e9e9e9}.slider.slider-settings-mounted.svelte-17se8gf.svelte-17se8gf::-webkit-slider-thumb{background:white}.slider.svelte-17se8gf.svelte-17se8gf::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:24px;height:20px;background:#e9e9e9;cursor:pointer}.slider.svelte-17se8gf.svelte-17se8gf::-moz-range-thumb{width:25px;height:25px;background:#e9e9e9;cursor:pointer}",
  map: '{"version":3,"file":"settings.svelte","sources":["settings.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import { onMount } from \\"svelte\\";\\n    import Header from \\"../lib/header/Header.svelte\\";\\n    import { store_settings } from \\"../stores/store.settings\\";\\n    import { const_game } from \\"../constants/const.game\\";\\n    import { set_cookie, import_cookies } from \\"../logic/cookies\\"\\n\\n    let sound_menu_selection = null;\\n    let settings_mounted = false;\\n\\n    onMount(() => {\\n        import_cookies();\\n        sound_menu_selection = new Audio(\\"/menu_selection.mp3\\");\\n        settings_mounted = true\\n    });\\n\\n    function play_menu_selection_sound(force_to_play = null) {\\n        if (\\n            ($store_settings.sounds || force_to_play === true) &&\\n            force_to_play != false\\n        ) {\\n            const new_sound = sound_menu_selection.cloneNode(true);\\n            new_sound.volume = $store_settings.volume / 100;\\n            new_sound.play();\\n        }\\n        return true;\\n    }\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<header class=\\"center\\">\\n    <Header />\\n</header>\\n<main class=\\"center\\">\\n    <p>first player to play</p>\\n    <div class=\\"options-line\\">\\n        <button\\n            on:click={() =>\\n                set_cookie(\\n                    \\"first_player_to_play\\",\\n                    const_game.players.first_player\\n                ) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_first_player(\\n                    const_game.players.first_player\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.first_player_to_play ===\\n                const_game.players.first_player}\\n            ><p>\\n                {$store_settings.mode === const_game.mode.human\\n                    ? \\"white\\"\\n                    : \\"player\\"}\\n            </p></button\\n        >\\n        <button\\n            on:click={() =>\\n                set_cookie(\\n                    \\"first_player_to_play\\",\\n                    const_game.players.second_player\\n                ) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_first_player(\\n                    const_game.players.second_player\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.first_player_to_play ===\\n                const_game.players.second_player}\\n            ><p>\\n                {$store_settings.mode === const_game.mode.human\\n                    ? \\"black\\"\\n                    : \\"bot\\"}\\n            </p></button\\n        >\\n    </div>\\n    <p>theme</p>\\n    <div class=\\"options-line\\">\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"theme\\", const_game.themes.green) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_theme(const_game.themes.green)}\\n            id=\\"option-green\\"\\n            class:option-selected={settings_mounted && $store_settings.theme ===\\n                const_game.themes.green}><p>green</p></button\\n        >\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"theme\\", const_game.themes.blue) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_theme(const_game.themes.blue)}\\n            id=\\"option-blue\\"\\n            class:option-selected={settings_mounted && $store_settings.theme ===\\n                const_game.themes.blue}><p>blue</p></button\\n        >\\n        <button\\n            on:click={() =>\\n                play_menu_selection_sound() &&\\n                set_cookie(\\"theme\\", const_game.themes.red) &&\\n                store_settings.update_theme(const_game.themes.red)}\\n            id=\\"option-red\\"\\n            class:option-selected={settings_mounted && $store_settings.theme ===\\n                const_game.themes.red}><p>red</p></button\\n        >\\n    </div>\\n    <div class=\\"options-line\\">\\n        <button\\n            on:click={() =>\\n                set_cookie(\\n                    \\"theme_border\\",\\n                    const_game.themes_border.with_border\\n                ) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_theme_border(\\n                    const_game.themes_border.with_border\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.theme_border ===\\n                const_game.themes_border.with_border}><p>full</p></button\\n        >\\n\\n        <!-- $store_settings.theme_border === -->\\n                <!-- const_game.themes_border.with_border -->\\n        <button\\n            on:click={() =>\\n                set_cookie(\\n                    \\"theme_border\\",\\n                    const_game.themes_border.without_border\\n                ) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_theme_border(\\n                    const_game.themes_border.without_border\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.theme_border ===\\n                const_game.themes_border.without_border}><p>light</p></button\\n        >\\n    </div>\\n    <p>sounds</p>\\n    <div class=\\"options-line\\">\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"sounds\\", const_game.sounds.on) &&\\n                play_menu_selection_sound(true) &&\\n                store_settings.update_sounds(const_game.sounds.on)}\\n            class:option-selected={settings_mounted && $store_settings.sounds ===\\n                const_game.sounds.on}><p>on</p></button\\n        >\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"sounds\\", const_game.sounds.off) &&\\n                play_menu_selection_sound(false) &&\\n                store_settings.update_sounds(const_game.sounds.off)}\\n            class:option-selected={settings_mounted && $store_settings.sounds ===\\n                const_game.sounds.off}><p>off</p></button\\n        >\\n    </div>\\n    <div class=\\"options-line\\">\\n        <input\\n            on:click={() =>\\n                set_cookie(\\"volume\\", $store_settings.volume) &&\\n                play_menu_selection_sound}\\n            type=\\"range\\"\\n            class=\\"slider\\"\\n            class:slider-settings-mounted={!settings_mounted}\\n            min={const_game.volume.min}\\n            max={const_game.volume.max}\\n            bind:value={$store_settings.volume}\\n        />\\n    </div>\\n    <p>bot difficulty</p>\\n    <div class=\\"options-line\\">\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"bot_difficulty\\", const_game.bot_difficulty.easy) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_bot_difficulty(\\n                    const_game.bot_difficulty.easy\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.bot_difficulty ===\\n                const_game.bot_difficulty.easy}><p>easy</p></button\\n        >\\n        <button\\n            on:click={() =>\\n                set_cookie(\\n                    \\"bot_difficulty\\",\\n                    const_game.bot_difficulty.medium\\n                ) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_bot_difficulty(\\n                    const_game.bot_difficulty.medium\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.bot_difficulty ===\\n                const_game.bot_difficulty.medium}><p>medium</p></button\\n        >\\n        <button\\n            on:click={() =>\\n                set_cookie(\\"bot_difficulty\\", const_game.bot_difficulty.hard) &&\\n                play_menu_selection_sound() &&\\n                store_settings.update_bot_difficulty(\\n                    const_game.bot_difficulty.hard\\n                )}\\n            class:option-selected={settings_mounted && $store_settings.bot_difficulty ===\\n                const_game.bot_difficulty.hard}><p>hard</p></button\\n        >\\n    </div>\\n</main>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    .options-line > button {\\n        display: inline-block;\\n        margin: 0 5px 15px 10px;\\n        padding: 0 15px;\\n        height: 55px;\\n        width: 90px;\\n        border: none;\\n        background-color: #e9e9e9;\\n        transition: opacity 0.2s;\\n    }\\n\\n    #option-blue {\\n        background-color: rgb(179, 244, 255);\\n    }\\n\\n    #option-green {\\n        background-color: rgb(179, 255, 189);\\n    }\\n\\n    #option-red {\\n        background-color: rgb(255, 179, 179);\\n    }\\n\\n    .options-line > button:not(.option-selected) {\\n        opacity: 0.4;\\n    }\\n\\n    .slider {\\n        -webkit-appearance: none;\\n        width: 240px;\\n        height: 20px;\\n        /* background: #e9e9e9; */\\n        outline: none;\\n        border: solid 3px #e9e9e9;\\n    }\\n\\n    .slider.slider-settings-mounted::-webkit-slider-thumb {\\n        background: white;\\n    }\\n\\n    .slider::-webkit-slider-thumb {\\n        -webkit-appearance: none;\\n        appearance: none;\\n        width: 24px;\\n        height: 20px;\\n        background: #e9e9e9;\\n        cursor: pointer;\\n    }\\n\\n    .slider::-moz-range-thumb {\\n        width: 25px;\\n        height: 25px;\\n        background: #e9e9e9;\\n        cursor: pointer;\\n    }\\n</style>\\n"],"names":[],"mappings":"AA+MI,4BAAa,CAAG,MAAM,eAAC,CAAC,AACpB,OAAO,CAAE,YAAY,CACrB,MAAM,CAAE,CAAC,CAAC,GAAG,CAAC,IAAI,CAAC,IAAI,CACvB,OAAO,CAAE,CAAC,CAAC,IAAI,CACf,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,OAAO,CAAC,IAAI,AAC5B,CAAC,AAED,YAAY,8BAAC,CAAC,AACV,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACxC,CAAC,AAED,aAAa,8BAAC,CAAC,AACX,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACxC,CAAC,AAED,WAAW,8BAAC,CAAC,AACT,gBAAgB,CAAE,IAAI,GAAG,CAAC,CAAC,GAAG,CAAC,CAAC,GAAG,CAAC,AACxC,CAAC,AAED,4BAAa,CAAG,qBAAM,KAAK,gBAAgB,CAAC,AAAC,CAAC,AAC1C,OAAO,CAAE,GAAG,AAChB,CAAC,AAED,OAAO,8BAAC,CAAC,AACL,kBAAkB,CAAE,IAAI,CACxB,KAAK,CAAE,KAAK,CACZ,MAAM,CAAE,IAAI,CAEZ,OAAO,CAAE,IAAI,CACb,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,OAAO,AAC7B,CAAC,AAED,OAAO,sDAAwB,sBAAsB,AAAC,CAAC,AACnD,UAAU,CAAE,KAAK,AACrB,CAAC,AAED,qCAAO,sBAAsB,AAAC,CAAC,AAC3B,kBAAkB,CAAE,IAAI,CACxB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,OAAO,AACnB,CAAC,AAED,qCAAO,kBAAkB,AAAC,CAAC,AACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,OAAO,AACnB,CAAC"}'
};
var Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store_settings, $$unsubscribe_store_settings;
  $$unsubscribe_store_settings = subscribe(store_settings, (value) => $store_settings = value);
  let settings_mounted = false;
  onMount(() => {
    import_cookies();
    new Audio("/menu_selection.mp3");
    settings_mounted = true;
  });
  $$result.css.add(css$1);
  $$unsubscribe_store_settings();
  return `



<header class="${"center"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}</header>
<main class="${"center"}"><p>first player to play</p>
    <div class="${"options-line svelte-17se8gf"}"><button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.first_player_to_play === const_game.players.first_player ? "option-selected" : ""
  ].join(" ").trim()}"><p>${escape2($store_settings.mode === const_game.mode.human ? "white" : "player")}</p></button>
        <button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.first_player_to_play === const_game.players.second_player ? "option-selected" : ""
  ].join(" ").trim()}"><p>${escape2($store_settings.mode === const_game.mode.human ? "black" : "bot")}</p></button></div>
    <p>theme</p>
    <div class="${"options-line svelte-17se8gf"}"><button id="${"option-green"}" class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.theme === const_game.themes.green ? "option-selected" : ""
  ].join(" ").trim()}"><p>green</p></button>
        <button id="${"option-blue"}" class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.theme === const_game.themes.blue ? "option-selected" : ""
  ].join(" ").trim()}"><p>blue</p></button>
        <button id="${"option-red"}" class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.theme === const_game.themes.red ? "option-selected" : ""
  ].join(" ").trim()}"><p>red</p></button></div>
    <div class="${"options-line svelte-17se8gf"}"><button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.theme_border === const_game.themes_border.with_border ? "option-selected" : ""
  ].join(" ").trim()}"><p>full</p></button>

        
                
        <button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.theme_border === const_game.themes_border.without_border ? "option-selected" : ""
  ].join(" ").trim()}"><p>light</p></button></div>
    <p>sounds</p>
    <div class="${"options-line svelte-17se8gf"}"><button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.sounds === const_game.sounds.on ? "option-selected" : ""
  ].join(" ").trim()}"><p>on</p></button>
        <button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.sounds === const_game.sounds.off ? "option-selected" : ""
  ].join(" ").trim()}"><p>off</p></button></div>
    <div class="${"options-line"}"><input type="${"range"}" class="${["slider svelte-17se8gf", !settings_mounted ? "slider-settings-mounted" : ""].join(" ").trim()}"${add_attribute("min", const_game.volume.min, 0)}${add_attribute("max", const_game.volume.max, 0)}${add_attribute("value", $store_settings.volume, 1)}></div>
    <p>bot difficulty</p>
    <div class="${"options-line svelte-17se8gf"}"><button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.bot_difficulty === const_game.bot_difficulty.easy ? "option-selected" : ""
  ].join(" ").trim()}"><p>easy</p></button>
        <button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.bot_difficulty === const_game.bot_difficulty.medium ? "option-selected" : ""
  ].join(" ").trim()}"><p>medium</p></button>
        <button class="${[
    "svelte-17se8gf",
    settings_mounted && $store_settings.bot_difficulty === const_game.bot_difficulty.hard ? "option-selected" : ""
  ].join(" ").trim()}"><p>hard</p></button></div></main>

`;
});
var settings = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Settings
});
var css = {
  code: ".reference-container.svelte-m7rt3t.svelte-m7rt3t.svelte-m7rt3t.svelte-m7rt3t{margin:0 auto;border:solid 4px black;padding:20px 0;width:380px}.reference-container.svelte-m7rt3t.svelte-m7rt3t.svelte-m7rt3t.svelte-m7rt3t{list-style-type:none}.reference-container.svelte-m7rt3t>li.svelte-m7rt3t>a.svelte-m7rt3t>img.svelte-m7rt3t{margin:10px 0;transition:transform 0.2s}.reference-container.svelte-m7rt3t>li.svelte-m7rt3t>a.svelte-m7rt3t:hover>img.svelte-m7rt3t{transform:scale(1.1)}",
  map: '{"version":3,"file":"about.svelte","sources":["about.svelte"],"sourcesContent":["<!-- ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ SCRIPT -->\\n<script>\\n    import Header from \\"../lib/header/Header.svelte\\";\\n<\/script>\\n\\n<!-- ************************************** CONTENT -->\\n<header class=\\"center\\">\\n    <Header />\\n</header>\\n<main class=\\"center\\">\\n    <ul class=\\"reference-container\\">\\n        <!-- src=\\"/static/svelte.png\\" -->\\n        <li>\\n            <p>built on</p>\\n            <a href=\\"https://svelte.dev/\\" target=\\"_blank\\"\\n                ><img\\n                    src=\\"https://blog.eleven-labs.com/assets/2021-02-22-a-la-decouverte-de-svelte/svelte-logo.png\\"\\n                    alt=\\"svelte logo\\"\\n                    width=\\"200px\\"\\n                /></a\\n            >\\n        </li>\\n        <!-- src=\\"/static/vercel.png\\" -->\\n        <li>\\n            <p>hosted on</p>\\n            <a href=\\"https://vercel.com/\\" target=\\"_blank\\"\\n                ><img\\n                    src=\\"https://ml.globenewswire.com/Resource/Download/3a54c241-a668-4c94-9747-3d3da9da3bf2?size=2\\"\\n                    alt=\\"vercel logo\\"\\n                    width=\\"200px\\"\\n                /></a\\n            >\\n        </li>\\n        <!-- src=\\"/static/github.png\\" -->\\n        <li>\\n            <p>uploaded on</p>\\n            <a href=\\"https://github.com/trixky/volte_face\\" target=\\"_blank\\"\\n                ><img\\n                    src=\\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAh1BMVEX///8AAAC5ubmvr68JCQnX19eEhITn5+fHx8eAgICkpKS9vb04ODheXl5MTEzAwMAjIyOUlJTv7+/g4OBzc3PR0dFTU1P5+fnb29vz8/NqamrKysp6enqenp60tLRCQkIqKiqYmJiMjIxQUFAWFhYeHh4yMjIpKSlGRkY8PDxtbW1hYWERERHAWPjYAAAIhklEQVR4nO2cC3eiPBCGRRahUtcK4r221V63/f+/7xPlMjOZkMS2H9jOc/bsOQ2EJK+5TGYCvZ4gCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCMJFkARR3/f9OFos265Kp0n9zbUHubvahm1XqpNkVx7L027RdtU6RjLhlSr0Gs7brmB3CP81SXVkIBPYkeXUKFXOru16doFbK6ly+m1XtW3CZ2utPG/2u6cu30GqnHXbFW4Ru9kKMmm7yq1x56yV563arnQ7zG/O0Mrz/rqUES6yLAsW4aUbHvPHs7SyVit4GMFcN++T6HLXh5cztTosiuaHJzs256t/VlXDaL2O1sf/aDmHxCNR5PC8qMqV2GX4e7ZWnjc1PHu+0eeFG/N5aNfXQHayT32tr8R27e4hE2BklaGhORYMG58dN2VN69tyE+/extL9U2cP8BXwk9ubzK5i9UH1X+0mrxe4djY5IvgRWFLdVpotFstru2IloPbjw3AYvxuU2uSTxQPXZoVm2+29vK12cwyM1W1XLDDUi2Yvm/rD7emeFCRpp63mflUN4CVIM86yrYq1BTV9LROXqyLlejTdXG3+zcpdY/3Lw1YH7JN7UbNW1fgdgrRbU31bFQvWHgyC7GY1DKD5uMyGo7d6Ru7NQL4X9slzg1bV8IVu2aqXgl6JLIE2xUIjpXlhwyDH85a7w7TI7rkbp8zzkSHQolj412fbrAHPR8wNiUe4H/jjLMjWY3+yyptc7cPhMHwoEzsoFm7y+WIxOUnMY4NDQ4m/r8Y0lDVlsqOmtygWbpBxdgVgq+DG8OinxihaLcyUSetKzyL+PtPWBfKGs2b0OjR1vWfDw8rVAuzLuycWaXGDeUmhS52iMzJtjdu+07QFe3bnhmFIWmxuVEVKs9Ib4DWbfW2apejvzokFl6Ecl3DzluQlbpEAXDINQpbOiUVcM24+dbKFvMJX4e/gsshWDOr8Y5j+vWKF/jT3ETzud0o4hnQOt9YsceZHfHXq8tzap/1WpCQx3LIWAh07vr1Y0+frgud6Lc7uy8STQwiI9d7zUSwQm+gZbq6L/Z5DDCnsWgfFGp2pcOo8NmD6x+OI3cQCOes5AoSRr4hY1x+kvHvYJDJlOWpF53g8aYELD5r8OrG08csxEYtMsXsbsUCbB72mwo4AHwi2K+28qpAnlB9ZtHCMjnX5PyuWnq8SC8wtOFToOgrpTnkDL8Fel+ryd18ssGzhdPdoPC4IRcXgdFgZb8sbysei42LVAxEnu5+BHKP8aDmEfr8qUTFkC6uCiEUtuIo2xCq7Fln7LcNmALKawkt9Lp0Rq8+I1ame5fF1/1Kxtlz6Z8WipoOeM8V6mkRpuBiiItZs3d2HIfGxf5VYvX4cx2MQ79+N45yTWf59Yr1VnhPoX5iwdXc/h0wCqF8m1hGw3dG5aPScJVZtD8IJasbW3X01bDBqPy+WxUZaz1liga0x3JycUoiT3P2cxgA/AF4ac+mXI9ZarREuwBwMpmCnBTIdYGnVZPjVYkXLBDB/JTk+IRZ0bSacWNfOYuH8yCiFulTzphLv+aRY52yk7cSCeYsNCHEqu57IC3B25FiGU6QyvkF8tqtiAadJsfCRYxuukxY5yYBDQ+DChma8ALHAtnmhZMxxHYc4N3HRgDfK/vwIsYgFroazGqGGNh7F0CNB3Q4XKRbtG26BBZL5A1+FUtJ19gLEAnNWqj7+iNGnCViRvCRggcwEEmG7ALFAKUs1J32oCWNWeI1EYC9ALKZGSpDVes+jaKV48JF5j0NT3RcLWoRVIn4LOsfubIh69EoJ3y/QZdTe/1+sOgxgJxbwp9xViYzr6M7sfVgzR5rVlRT/EP/AYmklFuiZKDpwllh1F7DyOkALFFiJRcp7f1v/kqPmsRjT0yQ5zJEjeqJ05GdhkoSLaAjeE9KLBUxedArTXizw2ki9zoMOS8WqlyhYIfBLFVWKD0bXBFRvM+b9pqlPF8ECzvrnRKXoxYKz4h44Ju3FAnHEon/MffjejeIpfdueun8GPRtgoJXb67yxCyzEnmxTlqOG1rPK6m/HrWLFwh3zcTa7U3zwRCzqdcAT6341Im++cT74x9lohlNgCWV3mh3qHOOc9MC2Nuqi21ZavHGtF4txUdy6iWWKRVgFLLBBXabmZ+AfoJWq7H/172/yR7uVgzYMerF0K7W9WIzcCCux8FatuvuQdxRqb8vRvrSk3VTOdDlQq3ix1I5sEAv8lidjw/Cym41Y9FBLVUauTu2jUnwFPWU7WNJwFNX04jUXZC15oje7ihXQB2BsxKLrXNVbR7nPbl3O4uoo7PXu+SfqtSLncBWekwaxlAVi6CgWDRIQsFjKTwOew7XnsECv55G3W42ufNZ0GHEPNMTQ5ppvAB24L2JcGrGUnuEsFtuxB2V8AIvFvRDCrVvlbcfhlNwe+tq6x44t1sgynr5ZPtBTYqfSqpkO+qBxTvzrHIch+JuIBVaEKtKodOxdUhWHDrPdH3oyWY9u+Pe3ynWkLGN+/GcnltXZ+XS4QoLtJ2hNSOPxiZiuKumkMu5mD0eTcRGX0HNfaXUFRmX7tQQfm1OWaNvPOQ2e/inafTR7l8P611lpj5WV5prhqCwj1r45ByQMolwQ56+8hUGWBe4nMWqSIC83sCs2OdQyaiyu+lTBqPHkmSrWXdPtP5X6IxjXu/56HfkDbnJTxHL6CMYPgprn3CeyqFjvzD2/A/JFNu4NgpX5lt+C7yiWy3c5fh4htNBNw3B/6d/f+TS3zWIBq+2s93F+GMtq5uJOIL03XfyNhCu9HoV9e/XrR2DN6aOunLWfj9Kn28v98tX3sB7yEZ54qPk4iCAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgvCt/AdfzXN0EvQrswAAAABJRU5ErkJggg==\\"\\n                    alt=\\"github logo\\"\\n                    width=\\"200px\\"\\n                /></a\\n            >\\n        </li>\\n    </ul>\\n</main>\\n\\n<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ STYLE -->\\n<style>\\n    .reference-container {\\n        margin: 0 auto;\\n        border: solid 4px black;\\n        padding: 20px 0;\\n        width: 380px;\\n    }\\n\\n    .reference-container {\\n        list-style-type: none;\\n    }\\n\\n    .reference-container > li > a > img {\\n        margin: 10px 0;\\n        transition: transform 0.2s;\\n    }\\n\\n    .reference-container > li > a:hover > img {\\n        transform: scale(1.1);\\n    }\\n</style>\\n"],"names":[],"mappings":"AAiDI,oBAAoB,wDAAC,CAAC,AAClB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,MAAM,CAAE,KAAK,CAAC,GAAG,CAAC,KAAK,CACvB,OAAO,CAAE,IAAI,CAAC,CAAC,CACf,KAAK,CAAE,KAAK,AAChB,CAAC,AAED,oBAAoB,wDAAC,CAAC,AAClB,eAAe,CAAE,IAAI,AACzB,CAAC,AAED,kCAAoB,CAAG,gBAAE,CAAG,eAAC,CAAG,GAAG,cAAC,CAAC,AACjC,MAAM,CAAE,IAAI,CAAC,CAAC,CACd,UAAU,CAAE,SAAS,CAAC,IAAI,AAC9B,CAAC,AAED,kCAAoB,CAAG,gBAAE,CAAG,eAAC,MAAM,CAAG,GAAG,cAAC,CAAC,AACvC,SAAS,CAAE,MAAM,GAAG,CAAC,AACzB,CAAC"}'
};
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `



<header class="${"center"}">${validate_component(Header, "Header").$$render($$result, {}, {}, {})}</header>
<main class="${"center"}"><ul class="${"reference-container svelte-m7rt3t"}">
        <li class="${"svelte-m7rt3t"}"><p>built on</p>
            <a href="${"https://svelte.dev/"}" target="${"_blank"}" class="${"svelte-m7rt3t"}"><img src="${"https://blog.eleven-labs.com/assets/2021-02-22-a-la-decouverte-de-svelte/svelte-logo.png"}" alt="${"svelte logo"}" width="${"200px"}" class="${"svelte-m7rt3t"}"></a></li>
        
        <li class="${"svelte-m7rt3t"}"><p>hosted on</p>
            <a href="${"https://vercel.com/"}" target="${"_blank"}" class="${"svelte-m7rt3t"}"><img src="${"https://ml.globenewswire.com/Resource/Download/3a54c241-a668-4c94-9747-3d3da9da3bf2?size=2"}" alt="${"vercel logo"}" width="${"200px"}" class="${"svelte-m7rt3t"}"></a></li>
        
        <li class="${"svelte-m7rt3t"}"><p>uploaded on</p>
            <a href="${"https://github.com/trixky/volte_face"}" target="${"_blank"}" class="${"svelte-m7rt3t"}"><img src="${"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAh1BMVEX///8AAAC5ubmvr68JCQnX19eEhITn5+fHx8eAgICkpKS9vb04ODheXl5MTEzAwMAjIyOUlJTv7+/g4OBzc3PR0dFTU1P5+fnb29vz8/NqamrKysp6enqenp60tLRCQkIqKiqYmJiMjIxQUFAWFhYeHh4yMjIpKSlGRkY8PDxtbW1hYWERERHAWPjYAAAIhklEQVR4nO2cC3eiPBCGRRahUtcK4r221V63/f+/7xPlMjOZkMS2H9jOc/bsOQ2EJK+5TGYCvZ4gCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCIIgCMJFkARR3/f9OFos265Kp0n9zbUHubvahm1XqpNkVx7L027RdtU6RjLhlSr0Gs7brmB3CP81SXVkIBPYkeXUKFXOru16doFbK6ly+m1XtW3CZ2utPG/2u6cu30GqnHXbFW4Ru9kKMmm7yq1x56yV563arnQ7zG/O0Mrz/rqUES6yLAsW4aUbHvPHs7SyVit4GMFcN++T6HLXh5cztTosiuaHJzs256t/VlXDaL2O1sf/aDmHxCNR5PC8qMqV2GX4e7ZWnjc1PHu+0eeFG/N5aNfXQHayT32tr8R27e4hE2BklaGhORYMG58dN2VN69tyE+/extL9U2cP8BXwk9ubzK5i9UH1X+0mrxe4djY5IvgRWFLdVpotFstru2IloPbjw3AYvxuU2uSTxQPXZoVm2+29vK12cwyM1W1XLDDUi2Yvm/rD7emeFCRpp63mflUN4CVIM86yrYq1BTV9LROXqyLlejTdXG3+zcpdY/3Lw1YH7JN7UbNW1fgdgrRbU31bFQvWHgyC7GY1DKD5uMyGo7d6Ru7NQL4X9slzg1bV8IVu2aqXgl6JLIE2xUIjpXlhwyDH85a7w7TI7rkbp8zzkSHQolj412fbrAHPR8wNiUe4H/jjLMjWY3+yyptc7cPhMHwoEzsoFm7y+WIxOUnMY4NDQ4m/r8Y0lDVlsqOmtygWbpBxdgVgq+DG8OinxihaLcyUSetKzyL+PtPWBfKGs2b0OjR1vWfDw8rVAuzLuycWaXGDeUmhS52iMzJtjdu+07QFe3bnhmFIWmxuVEVKs9Ib4DWbfW2apejvzokFl6Ecl3DzluQlbpEAXDINQpbOiUVcM24+dbKFvMJX4e/gsshWDOr8Y5j+vWKF/jT3ETzud0o4hnQOt9YsceZHfHXq8tzap/1WpCQx3LIWAh07vr1Y0+frgud6Lc7uy8STQwiI9d7zUSwQm+gZbq6L/Z5DDCnsWgfFGp2pcOo8NmD6x+OI3cQCOes5AoSRr4hY1x+kvHvYJDJlOWpF53g8aYELD5r8OrG08csxEYtMsXsbsUCbB72mwo4AHwi2K+28qpAnlB9ZtHCMjnX5PyuWnq8SC8wtOFToOgrpTnkDL8Fel+ryd18ssGzhdPdoPC4IRcXgdFgZb8sbysei42LVAxEnu5+BHKP8aDmEfr8qUTFkC6uCiEUtuIo2xCq7Fln7LcNmALKawkt9Lp0Rq8+I1ame5fF1/1Kxtlz6Z8WipoOeM8V6mkRpuBiiItZs3d2HIfGxf5VYvX4cx2MQ79+N45yTWf59Yr1VnhPoX5iwdXc/h0wCqF8m1hGw3dG5aPScJVZtD8IJasbW3X01bDBqPy+WxUZaz1liga0x3JycUoiT3P2cxgA/AF4ac+mXI9ZarREuwBwMpmCnBTIdYGnVZPjVYkXLBDB/JTk+IRZ0bSacWNfOYuH8yCiFulTzphLv+aRY52yk7cSCeYsNCHEqu57IC3B25FiGU6QyvkF8tqtiAadJsfCRYxuukxY5yYBDQ+DChma8ALHAtnmhZMxxHYc4N3HRgDfK/vwIsYgFroazGqGGNh7F0CNB3Q4XKRbtG26BBZL5A1+FUtJ19gLEAnNWqj7+iNGnCViRvCRggcwEEmG7ALFAKUs1J32oCWNWeI1EYC9ALKZGSpDVes+jaKV48JF5j0NT3RcLWoRVIn4LOsfubIh69EoJ3y/QZdTe/1+sOgxgJxbwp9xViYzr6M7sfVgzR5rVlRT/EP/AYmklFuiZKDpwllh1F7DyOkALFFiJRcp7f1v/kqPmsRjT0yQ5zJEjeqJ05GdhkoSLaAjeE9KLBUxedArTXizw2ki9zoMOS8WqlyhYIfBLFVWKD0bXBFRvM+b9pqlPF8ECzvrnRKXoxYKz4h44Ju3FAnHEon/MffjejeIpfdueun8GPRtgoJXb67yxCyzEnmxTlqOG1rPK6m/HrWLFwh3zcTa7U3zwRCzqdcAT6341Im++cT74x9lohlNgCWV3mh3qHOOc9MC2Nuqi21ZavHGtF4txUdy6iWWKRVgFLLBBXabmZ+AfoJWq7H/172/yR7uVgzYMerF0K7W9WIzcCCux8FatuvuQdxRqb8vRvrSk3VTOdDlQq3ix1I5sEAv8lidjw/Cym41Y9FBLVUauTu2jUnwFPWU7WNJwFNX04jUXZC15oje7ihXQB2BsxKLrXNVbR7nPbl3O4uoo7PXu+SfqtSLncBWekwaxlAVi6CgWDRIQsFjKTwOew7XnsECv55G3W42ufNZ0GHEPNMTQ5ppvAB24L2JcGrGUnuEsFtuxB2V8AIvFvRDCrVvlbcfhlNwe+tq6x44t1sgynr5ZPtBTYqfSqpkO+qBxTvzrHIch+JuIBVaEKtKodOxdUhWHDrPdH3oyWY9u+Pe3ynWkLGN+/GcnltXZ+XS4QoLtJ2hNSOPxiZiuKumkMu5mD0eTcRGX0HNfaXUFRmX7tQQfm1OWaNvPOQ2e/inafTR7l8P611lpj5WV5prhqCwj1r45ByQMolwQ56+8hUGWBe4nMWqSIC83sCs2OdQyaiyu+lTBqPHkmSrWXdPtP5X6IxjXu/56HfkDbnJTxHL6CMYPgprn3CeyqFjvzD2/A/JFNu4NgpX5lt+C7yiWy3c5fh4htNBNw3B/6d/f+TS3zWIBq+2s93F+GMtq5uJOIL03XfyNhCu9HoV9e/XrR2DN6aOunLWfj9Kn28v98tX3sB7yEZ54qPk4iCAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgvCt/AdfzXN0EvQrswAAAABJRU5ErkJggg=="}" alt="${"github logo"}" width="${"200px"}" class="${"svelte-m7rt3t"}"></a></li></ul></main>

`;
});
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About
});

// .svelte-kit/vercel/entry.js
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
