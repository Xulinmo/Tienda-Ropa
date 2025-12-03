--
-- PostgreSQL database dump
--

\restrict jPQNXzyYFVcXFCLrftCirNgudI0dz3nmfKoCotYGpLtk0MlWb9LMJ1neWtyXWpz

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    quantity integer DEFAULT 1 NOT NULL,
    added_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id integer NOT NULL,
    user_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    image_url text,
    category text,
    stock integer DEFAULT 10
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, product_id, quantity, added_at) FROM stdin;
94	1	6	1	2025-12-01 20:59:09.467371
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, product_id, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, description, price, image_url, category, stock) FROM stdin;
4	Vestido Verano	Vestido ligero y cÃ³modo	29.90	/images/vestido.jpg	mujer	27
5	Blusa Floral	Blusa con estampado de flores	24.50	/images/blusa.jpg	mujer	10
6	Zapatillas Deportivas	Zapatillas para running	59.99	/images/zapatillas.jpg	calzado	44
7	Botas de Cuero	Botas elegantes para invierno	89.99	/images/botas.jpg	calzado	17
8	Reloj Clásico	Reloj analÃ³gico con correa de cuero	149.99	/images/reloj.jpg	accesorios	12
9	Gafas de Sol	Gafas con protecciÃ³n UV	34.50	/images/gafas.jpg	accesorios	18
10	Bolso de Mano	Bolso elegante de piel sintÃ©tica	45.00	/images/bolso.jpg	accesorios	37
1	Camiseta Básica Blanca	Camiseta 100% algodÃ³n, talla M	12.50	/images/camiseta-blanca.jpg	hombre	45
2	Camiseta Básica Negra	Camiseta 100% algodÃ³n, talla M	12.50	/images/camiseta-negra.jpg	hombre	15
3	Jeans Slim Fit	Vaqueros azules ajustados	39.90	/images/jeans.jpg	hombre	45
21	Pantalon Bota Recta de Drill	Pantalón recto de drill para hombre	159.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439113/pantalonrectoh_gnhiab.webp	hombre	25
22	Polo Basico Levis	Polo básico marca Levis	99.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439120/pololevis_qixkj7.jpg	hombre	30
23	Jean Relaxed Dunkelvolk	Jean relaxed fit Dunkelvolk	139.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439088/jeansh_c7mte7.webp	hombre	20
24	Bermuda Ajustable	Bermuda ajustable para hombre	99.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439006/bermuda_a9b0kc.webp	hombre	35
25	Camisa Oxford	Camisa Oxford manga larga	107.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439025/camisao_n3n2cp.jpg	hombre	22
26	Polo Jersey Basico Papiros	Polo jersey básico de Papiros Denim	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439124/poloverde_jzpbco.webp	hombre	28
27	Jogger Deportivo	Jogger deportivo estilo sudadera	119.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439093/jogger_mcbxwl.webp	hombre	18
28	Chaqueta ligera	Chaqueta ligera para hombre	189.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439050/chaqueta_t2l4zk.jpg	hombre	15
29	Camisa Manga Larga Algodon	Camisa manga larga de algodón	95.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439020/camisam_h04rtt.webp	hombre	20
30	Chaleco sin mangas	Chaleco sin mangas casual	69.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439047/chaleco_dkay4a.webp	hombre	25
31	Falda Lapiz de Punto Elastico	Falda lÃ¡piz de punto elÃ¡stico	39.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439081/FALDA_LAPIZ_zjk5mr.jpg	mujer	30
32	Pantalon Bota Recta	PantalÃ³n bota recta para mujer	119.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439108/Pantalon_recto_rjcvsg.webp	mujer	25
33	Blusa Manga Corta	Blusa manga corta casual	59.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439009/blusaBlanca_jbrw0b.jpg	mujer	35
34	Falda Denim	Falda denim casual	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439070/faldadenim_hzcbbs.webp	mujer	22
35	Jean Skinny	Jean skinny ajustado	129.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439092/jeanskinnyy_flqqig.webp	mujer	28
36	Vestido Midi	Vestido midi elegante	149.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439137/vestidobeige_kmtdwr.webp	mujer	18
37	Blusa Satinada	Blusa satinada manga corta	89.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439011/blusanegra_q06yk4.jpg	mujer	24
38	Pantalon Cargo	PantalÃ³n cargo mujer	139.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439110/pantaloncargo_enn2hm.webp	mujer	20
39	Falda Plisada	Falda plisada elegante	99.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439079/faldaverde_bkqbmc.jpg	mujer	26
40	Vestido Corto	Vestido corto floral	119.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439140/vestidofloral_p1r5q9.webp	mujer	19
41	Zapatillas VL Court Mujer	Zapatillas VL Court para mujer	229.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439146/zapatillass_m36r7p.webp	calzado	30
42	Alpargatas Casual Mujer	Alpargatas casuales	139.50	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438992/alpargatas_i2psnq.webp	calzado	25
43	Zapatillas Outdoor Mujer	Zapatillas para exteriores	69.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439106/outdoor_z87hjt.webp	calzado	35
44	Zapatillas Running Mujer	Zapatillas para correr	199.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439130/running_b7ckwg.webp	calzado	28
45	Tenis Cuero Mujer	Tenis de cuero	164.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439062/cuero_r8rxr1.jpg	calzado	22
46	Zapatillas Basicas Hombre	Zapatillas bÃ¡sicas	180.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439002/basicas_nurmqh.jpg	calzado	40
47	Zapatos Derby Piel Hombre	Zapatos Derby de piel	220.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439065/derby_pk3y31.jpg	calzado	18
48	Botas Estilo Combat	Botas estilo combat	260.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439054/combat_r9lqic.webp	calzado	15
49	Mocasines de Cuero Hombre	Mocasines de cuero	210.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439102/mocasin_mspm94.webp	calzado	20
50	Gafas de sol cuadradas	Gafas de sol estilo cuadrado	120.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439058/cuadrado_ddnwdr.webp	accesorios	50
51	Reloj de pulsera acero inox	Reloj de acero inoxidable	229.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439128/reloj_vitutp.jpg	accesorios	25
52	Reloj pulsera malla metalica	Reloj pulsera malla metÃ¡lica	189.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439098/malla_ufnrrh.jpg	accesorios	18
53	Cartera de dos asas Lya	Cartera con dos asas	99.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439035/cartera_jgq6h4.webp	accesorios	30
54	Cartera Amara	Cartera elegante Amara	134.50	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438997/amaraa_hfazcw.jpg	accesorios	22
55	Cinturon de cuero hombre	CinturÃ³n de cuero genuino	169.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439053/cinturon_vqurva.webp	accesorios	35
56	Bucket hat reversible cereza	Sombrero bucket reversible	39.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439046/cerezaa_mwjvug.webp	accesorios	40
57	Lentes de sol rectangulares negro	Lentes de sol negros	34.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439096/lentes_wh4r8y.webp	accesorios	45
58	Set de anillos frutales dorados	Set de anillos dorados	49.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438998/anillos_gp4zd0.webp	accesorios	60
59	PaÃ±uelo de seda	PaÃ±uelo de seda elegante	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439119/paÃ±ueloo_jqzumu.jpg	accesorios	28
60	Camisa casual manga larga hombre	Camisa casual con descuento	71.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439016/camisacasual_fvedri.jpg	hombre	25
61	Jean cropped mujer	Jean cropped en oferta	83.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439087/jeancortoo_z0284k.jpg	mujer	20
62	Casaca ligera rompeviento hombre	Casaca rompeviento	112.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439040/casaca_puuw3f.avif	hombre	18
63	Blusa satinada manga corta mujer	Blusa satinada en oferta	59.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439031/camisarosa_fjjwse.avif	mujer	22
64	Sneakers urbanas mujer	Sneakers urbanas con descuento	110.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439132/sneackers_e6xbzd.jpg	calzado	30
65	Jogger tecnico deportivo hombre	Jogger tÃ©cnico deportivo	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439135/ultimo_zdxmmg.webp	hombre	28
66	Falda Lapiz de Punto Elastico	Falda lÃ¡piz de punto elÃ¡stico	39.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439081/FALDA_LAPIZ_zjk5mr.jpg	mujer	30
67	Pantalon Bota Recta	PantalÃ³n bota recta para mujer	119.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439108/Pantalon_recto_rjcvsg.webp	mujer	25
68	Blusa Manga Corta	Blusa manga corta casual	59.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439009/blusaBlanca_jbrw0b.jpg	mujer	35
69	Falda Denim	Falda denim casual	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439070/faldadenim_hzcbbs.webp	mujer	22
70	Jean Skinny	Jean skinny ajustado	129.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439092/jeanskinnyy_flqqig.webp	mujer	28
71	Vestido Midi	Vestido midi elegante	149.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439137/vestidobeige_kmtdwr.webp	mujer	18
72	Blusa Satinada	Blusa satinada manga corta	89.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439011/blusanegra_q06yk4.jpg	mujer	24
73	Pantalon Cargo	PantalÃ³n cargo mujer	139.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439110/pantaloncargo_enn2hm.webp	mujer	20
74	Falda Plisada	Falda plisada elegante	99.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439079/faldaverde_bkqbmc.jpg	mujer	26
75	Vestido Corto	Vestido corto floral	119.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439140/vestidofloral_p1r5q9.webp	mujer	19
76	Zapatillas VL Court Mujer	Zapatillas VL Court para mujer	229.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439146/zapatillass_m36r7p.webp	calzado	30
77	Alpargatas Casual Mujer	Alpargatas casuales	139.50	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438992/alpargatas_i2psnq.webp	calzado	25
78	Zapatillas Outdoor Mujer	Zapatillas para exteriores	69.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439106/outdoor_z87hjt.webp	calzado	35
79	Zapatillas Running Mujer	Zapatillas para correr	199.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439130/running_b7ckwg.webp	calzado	28
80	Tenis Cuero Mujer	Tenis de cuero	164.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439062/cuero_r8rxr1.jpg	calzado	22
81	Zapatillas Basicas Hombre	Zapatillas bÃ¡sicas	180.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439002/basicas_nurmqh.jpg	calzado	40
82	Zapatos Derby Piel Hombre	Zapatos Derby de piel	220.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439065/derby_pk3y31.jpg	calzado	18
83	Botas Estilo Combat	Botas estilo combat	260.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439054/combat_r9lqic.webp	calzado	15
84	Mocasines de Cuero Hombre	Mocasines de cuero	210.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439102/mocasin_mspm94.webp	calzado	20
85	Gafas de sol cuadradas	Gafas de sol estilo cuadrado	120.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439058/cuadrado_ddnwdr.webp	accesorios	50
86	Reloj de pulsera acero inox	Reloj de acero inoxidable	229.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439128/reloj_vitutp.jpg	accesorios	25
87	Reloj pulsera malla metalica	Reloj pulsera malla metÃ¡lica	189.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439098/malla_ufnrrh.jpg	accesorios	18
88	Cartera de dos asas Lya	Cartera con dos asas	99.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439035/cartera_jgq6h4.webp	accesorios	30
89	Cartera Amara	Cartera elegante Amara	134.50	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438997/amaraa_hfazcw.jpg	accesorios	22
90	Cinturon de cuero hombre	CinturÃ³n de cuero genuino	169.00	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439053/cinturon_vqurva.webp	accesorios	35
91	Bucket hat reversible cereza	Sombrero bucket reversible	39.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439046/cerezaa_mwjvug.webp	accesorios	40
92	Lentes de sol rectangulares negro	Lentes de sol negros	34.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439096/lentes_wh4r8y.webp	accesorios	45
93	Set de anillos frutales dorados	Set de anillos dorados	49.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764438998/anillos_gp4zd0.webp	accesorios	60
94	PaÃ±uelo de seda	PaÃ±uelo de seda elegante	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439119/paÃ±ueloo_jqzumu.jpg	accesorios	28
95	Camisa casual manga larga hombre	Camisa casual con descuento	71.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439016/camisacasual_fvedri.jpg	hombre	25
96	Jean cropped mujer	Jean cropped en oferta	83.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439087/jeancortoo_z0284k.jpg	mujer	20
97	Casaca ligera rompeviento hombre	Casaca rompeviento	112.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439040/casaca_puuw3f.avif	hombre	18
98	Blusa satinada manga corta mujer	Blusa satinada en oferta	59.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439031/camisarosa_fjjwse.avif	mujer	22
99	Sneakers urbanas mujer	Sneakers urbanas con descuento	110.40	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439132/sneackers_e6xbzd.jpg	calzado	30
100	Jogger tecnico deportivo hombre	Jogger tÃ©cnico deportivo	79.90	https://res.cloudinary.com/dbxk9cbjp/image/upload/v1764439135/ultimo_zdxmmg.webp	hombre	28
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
1	Usuario Demo	demo@tienda.com	\N	2025-11-30 22:39:28.406141
2	Leonardo Reyes	leonardo@gmail.com	123456	2025-11-30 22:42:42.239165
\.


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 94, true);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 100, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 2, true);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart cart_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict jPQNXzyYFVcXFCLrftCirNgudI0dz3nmfKoCotYGpLtk0MlWb9LMJ1neWtyXWpz

