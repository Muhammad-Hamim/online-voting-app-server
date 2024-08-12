import { Router } from "express";
import { UserRoute } from "../Models/user/user.route";
import { PositionRoute } from "../Models/position/position.route";
import { CandidateRoute } from "../Models/candidate/candidate.route";
import { VoteRoute } from "../Models/vote/vote.route";
import { AuthRoutes } from "../Models/auth/auth.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoute,
  },
  {
    path: "/positions",
    route: PositionRoute,
  },
  {
    path: "/candidate",
    route: CandidateRoute,
  },
  {
    path: "/votes",
    route: VoteRoute,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
