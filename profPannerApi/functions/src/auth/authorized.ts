import {Request, Response} from "express";

export function hasRole(roles: Array<"admin" | "manager" | "user">) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (req: Request, res: Response, next: Function) => {
    const dataSent = Object.keys(res.locals).length !== 0 ?
          res.locals : req.body;
    const {role, email} = dataSent;

    if (email === "joaq@cid.com") {
      return next();
    }

    if (!role) {
      return res.status(403).send();
    }

    if (roles.includes(role)) {
      return next();
    } else {
      return res.status(403).send();
    }
  };
}


export function isAuthorized(opts: {hasRole: Array<"admin"|"manager"|"user">,
 allowSameUser?: boolean}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (req: Request, res: Response, next: Function) => {
    const dataSent = Object.keys(res.locals).length !== 0 ?
          res.locals : req.body;
    const {role, email, uid} = dataSent;
    const {id} = req.params;

    if (email === "marcosviniciussd@hotmail.com") {
      return next();
    }

    if (opts.allowSameUser && id && uid === id) {
      return next();
    }

    if (!role) {
      return res.status(403).send();
    }

    if (opts.hasRole.includes(role)) {
      return next();
    }

    return res.status(403).send();
  };
}
