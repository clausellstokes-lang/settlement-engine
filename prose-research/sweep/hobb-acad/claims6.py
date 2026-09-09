# -*- coding: utf-8 -*-
PJ_URL="https://peerj.com/articles/cs-189/"
PJ_SRC="Niels Dekker, Tobias Kuhn and Marieke van Erp, 'Evaluating named entity recognition tools for extracting social networks from novels', PeerJ Computer Science 5 (18 April 2019) e189"
PJ_ROUTE="peerj.com returns 403 to a plain fetch; read through the Wayback raw capture https://web.archive.org/web/20260208122918id_/https://peerj.com/articles/cs-189/"
CLAIMS=[
 dict(feature='stylometry',
   claim="Dekker, Kuhn and van Erp's gold-standard dataset is 20 classic and 20 modern novels, the modern set including Hobb's Assassin's Apprentice, with the first chapter of each manually annotated.",
   source=PJ_SRC,url=PJ_URL,quote="20 classic and 20 modern novels",
   page="Materials and Data Preparation; Table of modern novels",kind='measurement',polarity='applies',date='2019-04-18',
   routeHint=PJ_ROUTE,registerHint='none',confidence='high',_file='peerj-wb.txt'),
 dict(feature='point of view and distance',
   claim="They report that automatic entity recognition performs significantly better on third-person novels than on first-person ones, a class that includes Assassin's Apprentice.",
   source=PJ_SRC,url=PJ_URL,quote="novels written in 3rd person perspective perform significantly better than",
   page="Conclusion and Future Work",kind='measurement',polarity='asserts',date='2019-04-18',
   routeHint=PJ_ROUTE,registerHint='none',confidence='high',_file='peerj-wb.txt'),
]
