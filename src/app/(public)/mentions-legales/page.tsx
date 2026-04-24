import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <section className="bg-[#FBFAF8]">
          <div className="max-w-[780px] mx-auto px-4 lg:px-0 pt-20 pb-12 md:pt-28 md:pb-16">
            <h1 className="text-[32px] md:text-[48px] font-semibold leading-[1.08] tracking-tight text-foreground text-center">
              CGV &amp; Mentions légales
            </h1>
            <p className="text-[17px] text-muted-foreground text-center mt-3">
              Politique de confidentialité
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <a href="#cgv" className="text-sm text-primary font-medium hover:underline">
                Conditions générales de vente
              </a>
              <span className="text-muted-foreground/30">|</span>
              <a href="#mentions" className="text-sm text-primary font-medium hover:underline">
                Mentions légales
              </a>
            </div>
          </div>
        </section>

        {/* CGV */}
        <section id="cgv" className="bg-white">
          <div className="max-w-[780px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground mb-10">
              Conditions générales de vente
            </h2>

            <div className="prose-legal space-y-8 text-[15px] text-muted-foreground leading-[1.7]">
              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Préambule</h3>
                <p>Les présentes conditions générales de vente s’appliquent à toutes les ventes conclues sur le site Internet <a href="https://so-ma.fr/" className="text-primary hover:underline">so-ma.fr</a>.</p>
                <p className="mt-2">Les présentes conditions générales de vente sont conclues entre :</p>
                <p className="mt-2"><strong className="text-foreground">SO-MA</strong>, entreprise individuelle micro-entreprise immatriculée sous le SIRET 91159168300014, dont les informations légales complètes figurent dans la page « Mentions légales » du site.</p>
                <p className="mt-2">Le site Internet <a href="https://so-ma.fr/" className="text-primary hover:underline">https://so-ma.fr/</a> commercialise les produits suivants : programmes diététiques, alimentaires et sportifs.</p>
                <p className="mt-2">Le client déclare avoir pris connaissance et avoir accepté les conditions générales de vente antérieurement à la passation de sa commande. La validation de la commande vaut donc acceptation des conditions générales de vente.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 1 – Principes</h3>
                <p>Les présentes conditions générales expriment l’intégralité des obligations des parties. En ce sens, l’acheteur est réputé les accepter sans réserve.</p>
                <p className="mt-2">Les présentes conditions générales de vente s’appliquent à l’exclusion de toutes autres conditions, et notamment celles applicables pour les ventes en magasin ou au moyen d’autres circuits de distribution et de commercialisation. Elles sont accessibles sur le site internet so-ma.fr et prévaudront, le cas échéant, sur toute autre version ou tout autre document contradictoire.</p>
                <p className="mt-2">Le vendeur et l’acheteur conviennent que les présentes conditions générales régissent exclusivement leur relation. Le vendeur se réserve le droit de modifier ponctuellement ses conditions générales. Elles seront applicables dès leur mise en ligne.</p>
                <p className="mt-2">Si une condition de vente venait à faire défaut, elle serait considérée comme étant régie par les usages en vigueur dans le secteur de la vente à distance dont les sociétés ont leur siège en France. Les conditions générales de vente sont les seules conditions applicables à la transaction.</p>
                <p className="mt-2">Les présentes conditions générales de vente sont valables sur toute la période d’ouverture du site internet.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 2 – Contenu</h3>
                <p>Les présentes conditions générales ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne de biens proposés par le vendeur à l’acheteur, à partir du site internet <a href="https://so-ma.fr/" className="text-primary hover:underline">https://so-ma.fr/</a>.</p>
                <p className="mt-2">Les présentes conditions ne concernent que les achats effectués sur le site de <a href="https://so-ma.fr/" className="text-primary hover:underline">https://so-ma.fr/</a>.</p>
                <p className="mt-2">Ces achats concernent les produits suivants : programmes diététiques, alimentaires et sportifs.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 3 – Informations précontractuelles</h3>
                <p>L’acheteur reconnaît avoir eu communication, préalablement à la passation de sa commande et à la conclusion du contrat, d’une manière lisible et compréhensible, des présentes conditions générales de vente et de toutes les informations listées à l’article L. 221-5 du code de la consommation.</p>
                <p className="mt-2">Sont transmises à l’acheteur, de manière claire et compréhensible, les informations suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>les caractéristiques essentielles du bien ;</li>
                  <li>le prix du bien et/ou le mode de calcul du prix ;</li>
                  <li>s’il y a lieu, tous les autres frais éventuels exigibles ;</li>
                  <li>en l’absence d’exécution immédiate du contrat, la date ou le délai auquel le vendeur s’engage à livrer le bien, quel que soit son prix ;</li>
                  <li>les informations relatives à l’identité du vendeur et à ses activités, celles relatives aux garanties légales, aux fonctionnalités du contenu numérique.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 4 – La commande</h3>
                <p>L’acheteur a la possibilité de passer sa commande en ligne, à partir du catalogue en ligne pour tout produit, dans la limite des stocks disponibles.</p>
                <p className="mt-2">L’acheteur sera informé de toute indisponibilité du produit ou du bien commandé.</p>
                <p className="mt-2">Pour que la commande soit validée, l’acheteur devra accepter, en cliquant à l’endroit indiqué, les présentes conditions générales. Il devra aussi choisir l’adresse et le mode de livraison, et enfin valider le mode de paiement. La vente sera considérée comme définitive :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>après l’envoi à l’acheteur de la confirmation de l’acceptation de la commande par le vendeur par courrier électronique ;</li>
                  <li>et après encaissement par le vendeur de l’intégralité du prix ou d’une fraction du prix.</li>
                </ul>
                <p className="mt-2">Toute commande vaut acceptation des prix et de la description des produits disponibles à la vente. Toute contestation sur ce point interviendra dans le cadre d’un éventuel échange et des garanties ci-dessous mentionnées. Dans certains cas, notamment défaut de paiement, adresse erronée ou autre problème sur le compte de l’acheteur, le vendeur se réserve le droit de bloquer la commande de l’acheteur jusqu’à la résolution du problème.</p>
                <p className="mt-2">Pour toute question relative au suivi d’une commande, l’acheteur peut contacter le service client à l’adresse mail suivante : <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 5 – Signature électronique</h3>
                <p>La fourniture en ligne du numéro de carte bancaire de l’acheteur et la validation finale de la commande vaudront preuve de l’accord de l’acheteur :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>exigibilité des sommes dues au titre du bon de commande ;</li>
                  <li>signature et acceptation expresse de toutes les opérations effectuées.</li>
                </ul>
                <p className="mt-2">En cas d’utilisation frauduleuse de la carte bancaire, l’acheteur est invité, dès le constat de cette utilisation, à contacter le service client.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 6 – Confirmation de commande</h3>
                <p>Le vendeur fournit à l’acheteur une confirmation de commande, par messagerie électronique.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 7 – Preuve de la transaction</h3>
                <p>Les registres informatisés, conservés dans les systèmes informatiques du vendeur dans des conditions raisonnables de sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les parties. L’archivage des bons de commande et des factures est effectué sur un support fiable et durable pouvant être produit à titre de preuve.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 8 – Informations sur les produits</h3>
                <p>Les produits régis par les présentes conditions générales sont ceux qui figurent sur le site internet du vendeur et qui sont indiqués comme vendus et expédiés par le vendeur. Ils sont proposés dans la limite des stocks disponibles. Les produits sont décrits et présentés avec la plus grande exactitude possible. Toutefois, si des erreurs ou omissions ont pu se produire quant à cette présentation, la responsabilité du vendeur ne pourrait être engagée.</p>
                <p className="mt-2">Les photographies des produits appartiennent à l’entreprise So-ma et sont interdites de reproduction, ou d’utilisation sans autorisation !</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 9 – Prix</h3>
                <p>Le vendeur se réserve le droit de modifier ses prix à tout moment mais s’engage à appliquer les tarifs en vigueur indiqués au moment de la commande.</p>
                <p className="mt-2">Les prix sont indiqués en euros, toutes taxes comprises. En tant que micro-entrepreneur bénéficiant de la franchise en base de TVA (article 293 B du CGI), la TVA n’est pas applicable — le prix affiché est le prix final payé, sans supplément.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 10 – Mode de paiement</h3>
                <p>Il s’agit d’une commande avec obligation de paiement, ce qui signifie que la passation de la commande implique un règlement de l’acheteur.</p>
                <p className="mt-2">Pour régler sa commande, l’acheteur dispose, à son choix, de l’ensemble des modes de paiement mis à sa disposition par le vendeur et listés sur le site du vendeur. L’acheteur garantit au vendeur qu’il dispose des autorisations éventuellement nécessaires pour utiliser le mode de paiement choisi par lui, lors de la validation du bon de commande. Le vendeur se réserve le droit de suspendre toute gestion de commande et toute livraison en cas de refus d’autorisation de paiement par carte bancaire de la part des organismes officiellement accrédités ou en cas de non-paiement. Le vendeur se réserve notamment le droit de refuser d’effectuer une livraison ou d’honorer une commande émanant d’un acheteur qui n’aurait pas réglé totalement ou partiellement une commande précédente ou avec lequel un litige de paiement serait en cours d’administration.</p>
                <p className="mt-2">Le paiement du prix s’effectue en totalité au jour de la commande, selon les modalités suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>carte bancaire (paiement comptant)</li>
                  <li>PayPal</li>
                </ul>
                <p className="mt-2">Le paiement du prix peut également être effectué selon un échéancier, avec un montant et des versements échelonnés sur une période déterminée entre le vendeur et l’acheteur au cas par cas, selon les modalités suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>carte de paiement</li>
                  <li>PayPal</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 11 – Garantie des produits</h3>
                <p className="font-medium text-foreground">Garanties légales des vices cachés</p>
                <p className="mt-2">Conformément aux articles 1641 et suivants du code civil, le vendeur est garant des vices cachés pouvant affecter le bien vendu. Il appartiendra à l’acheteur de prouver que les vices existaient à la vente du bien et sont de nature à rendre le bien impropre à l’usage auquel il est destiné. Cette garantie doit être mise en œuvre dans un délai de deux ans à compter de la découverte du vice.</p>
                <p className="mt-2">L’acheteur peut choisir entre la résolution de la vente ou une réduction du prix conformément à l’article 1644 du code civil.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 12 – Droit de rétractation</h3>
                <p className="font-medium text-foreground">Application du droit de rétractation</p>
                <p className="mt-2">Le droit de rétractation ne s’applique pas dans ce cas, où l’accès à la commande est immédiat et définitif (sauf cas exceptionnels).</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 13 – Force majeure</h3>
                <p>Toutes circonstances indépendantes de la volonté des parties empêchant l’exécution dans des conditions normales de leurs obligations sont considérées comme des causes d’exonération des obligations des parties et entraînent leur suspension. La partie qui invoque les circonstances visées ci-dessus doit avertir immédiatement l’autre partie de leur survenance, ainsi que de leur disparition.</p>
                <p className="mt-2">Seront considérés comme cas de force majeure tous faits ou circonstances irrésistibles, extérieurs aux parties, imprévisibles, inévitables, indépendants de la volonté des parties et qui ne pourront être empêchés par ces dernières, malgré tous les efforts raisonnablement possibles. De façon expresse, sont considérés comme cas de force majeure ou cas fortuits, outre ceux habituellement retenus par la jurisprudence des cours et des tribunaux français : le blocage des moyens de transports ou d’approvisionnements, tremblements de terre, incendies, tempêtes, inondations, foudre, l’arrêt des réseaux de télécommunication ou difficultés propres aux réseaux de télécommunication externes aux clients. Les parties se rapprocheront pour examiner l’incidence de l’événement et convenir des conditions dans lesquelles l’exécution du contrat sera poursuivie. Si le cas de force majeure a une durée supérieure à trois mois, les présentes conditions générales pourront être résiliées par la partie lésée.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 14 – Propriété intellectuelle</h3>
                <p>Le contenu du site internet reste la propriété du vendeur, seul titulaire des droits de propriété intellectuelle sur ce contenu. Les acheteurs s’engagent à ne faire aucun usage de ce contenu ; toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 15 – Informatique et libertés</h3>
                <p>Les données nominatives fournies par l’acheteur sont nécessaires au traitement de sa commande et à l’établissement des factures.</p>
                <p className="mt-2">Elles peuvent être communiquées aux partenaires du vendeur chargés de l’exécution, du traitement, de la gestion et du paiement des commandes.</p>
                <p className="mt-2">L’acheteur dispose d’un droit d’accès permanent, de modification, de rectification et d’opposition s’agissant des informations le concernant. Ce droit peut être exercé dans les conditions et selon les modalités définies sur le site so-ma.fr.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 16 – Non-validation partielle</h3>
                <p>Si une ou plusieurs stipulations des présentes conditions générales sont tenues pour non valides ou déclarées telles en application d’une loi, d’un règlement ou à la suite d’une décision définitive d’une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 17 – Non-renonciation</h3>
                <p>Le fait pour l’une des parties de ne pas se prévaloir d’un manquement par l’autre partie à l’une quelconque des obligations visées dans les présentes conditions générales ne saurait être interprété pour l’avenir comme une renonciation à l’obligation en cause.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 18 – Langue du contrat</h3>
                <p>Les présentes conditions générales de vente sont rédigées en langue française. Dans le cas où elles seraient traduites en une ou plusieurs langues étrangères, seul le texte français ferait foi en cas de litige.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 19 – Loi applicable</h3>
                <p>Les présentes conditions générales sont soumises à l’application du droit français. Le tribunal compétent est le tribunal judiciaire.</p>
                <p className="mt-2">Il en est ainsi pour les règles de fond comme pour les règles de forme. En cas de litige ou de réclamation, l’acheteur s’adressera en priorité au vendeur pour obtenir une solution amiable.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 20 – Protection des données personnelles</h3>

                <p className="font-medium text-foreground mt-1">Données collectées</p>
                <p className="mt-2">Les données à caractère personnel qui sont collectées sur ce site sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-foreground">Ouverture de compte :</strong> lors de la création du compte de l’utilisateur, ses nom, prénom, adresse électronique, n° de téléphone, adresse postale ;</li>
                  <li><strong className="text-foreground">Connexion :</strong> lors de la connexion de l’utilisateur au site web, celui-ci enregistre, notamment, son nom, son prénom, ses données de connexion, d’utilisation, de localisation et ses données relatives au paiement ;</li>
                  <li><strong className="text-foreground">Profil :</strong> l’utilisation des prestations prévues sur le site web permet de renseigner un profil, pouvant comprendre une adresse et un numéro de téléphone ;</li>
                  <li><strong className="text-foreground">Paiement :</strong> dans le cadre du paiement des produits et prestations proposés sur le site web, celui-ci enregistre des données financières relatives au compte bancaire ou à la carte de crédit de l’utilisateur ;</li>
                  <li><strong className="text-foreground">Cookies :</strong> les cookies sont utilisés dans le cadre de l’utilisation du site. L’utilisateur a la possibilité de désactiver les cookies à partir des paramètres de son navigateur.</li>
                </ul>

                <p className="font-medium text-foreground mt-4">Utilisation des données personnelles</p>
                <p className="mt-2">Les données personnelles collectées auprès des utilisateurs ont pour objectif la mise à disposition des services du site web, leur amélioration et le maintien d’un environnement sécurisé. Plus précisément, les utilisations sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>accès et utilisation du site web par l’utilisateur ;</li>
                  <li>gestion du fonctionnement et optimisation du site web ;</li>
                  <li>organisation des conditions d’utilisation des Services de paiement ;</li>
                  <li>vérification, identification et authentification des données transmises par l’utilisateur ;</li>
                  <li>proposition à l’utilisateur de la possibilité de communiquer avec d’autres utilisateurs du site web ;</li>
                  <li>mise en œuvre d’une assistance utilisateurs ;</li>
                  <li>personnalisation des services en affichant des publicités en fonction de l’historique de navigation de l’utilisateur, selon ses préférences ;</li>
                  <li>prévention et détection des fraudes, malwares (malicious softwares ou logiciels malveillants) et gestion des incidents de sécurité ;</li>
                  <li>gestion des éventuels litiges avec les utilisateurs ;</li>
                  <li>envoi d’informations commerciales et publicitaires, en fonction des préférences de l’utilisateur.</li>
                </ul>

                <p className="font-medium text-foreground mt-4">Partage des données personnelles avec des tiers</p>
                <p className="mt-2">Les données personnelles peuvent être partagées avec des sociétés tierces, dans les cas suivants :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>lorsque l’utilisateur utilise les services de paiement, pour la mise en œuvre de ces services, le site web est en relation avec des sociétés bancaires et financières tierces avec lesquelles il a passé des contrats ;</li>
                  <li>lorsque l’utilisateur publie, dans les zones de commentaires libres du site web, des informations accessibles au public ;</li>
                  <li>lorsque l’utilisateur autorise le site web d’un tiers à accéder à ses données ;</li>
                  <li>si la loi l’exige, le site web peut effectuer la transmission de données pour donner suite aux réclamations présentées contre le site web et se conformer aux procédures administratives et judiciaires ;</li>
                  <li>si le site web est impliqué dans une opération de fusion, acquisition, cession d’actifs ou procédure de redressement judiciaire, il pourra être amené à céder ou partager tout ou partie de ses actifs, y compris les données à caractère personnel. Dans ce cas, les utilisateurs seraient informés, avant que les données à caractère personnel ne soient transférées à une tierce partie.</li>
                </ul>

                <p className="font-medium text-foreground mt-4">Sécurité et confidentialité</p>
                <p className="mt-2">Le site web met en œuvre des mesures organisationnelles, techniques, logicielles et physiques en matière de sécurité du numérique pour protéger les données personnelles contre les altérations, destructions et accès non autorisés. Toutefois, il est à signaler qu’internet n’est pas un environnement complètement sécurisé et le site web ne peut pas garantir la sécurité de la transmission ou du stockage des informations sur internet.</p>

                <p className="font-medium text-foreground mt-4">Mise en œuvre des droits des utilisateurs</p>
                <p className="mt-2">En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent des droits suivants, qu’ils peuvent exercer en faisant leur demande à l’adresse suivante : <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-foreground">Le droit d’accès :</strong> ils peuvent exercer leur droit d’accès, pour connaître les données personnelles les concernant. Dans ce cas, avant la mise en œuvre de ce droit, le site web peut demander une preuve de l’identité de l’utilisateur afin d’en vérifier l’exactitude.</li>
                  <li><strong className="text-foreground">Le droit de rectification :</strong> si les données à caractère personnel détenues par le site web sont inexactes, ils peuvent demander la mise à jour des informations.</li>
                  <li><strong className="text-foreground">Le droit de suppression des données :</strong> les utilisateurs peuvent demander la suppression de leurs données à caractère personnel, conformément aux lois applicables en matière de protection des données.</li>
                  <li><strong className="text-foreground">Le droit à la limitation du traitement :</strong> les utilisateurs peuvent demander au site web de limiter le traitement des données personnelles conformément aux hypothèses prévues par le RGPD.</li>
                  <li><strong className="text-foreground">Le droit de s’opposer au traitement des données :</strong> les utilisateurs peuvent s’opposer à ce que ses données soient traitées conformément aux hypothèses prévues par le RGPD.</li>
                  <li><strong className="text-foreground">Le droit à la portabilité :</strong> ils peuvent réclamer que le site web leur remette les données personnelles qui lui sont fournies pour les transmettre à un nouveau site web.</li>
                </ul>

                <p className="font-medium text-foreground mt-4">Évolution de la présente clause</p>
                <p className="mt-2">Le site web se réserve le droit d’apporter toute modification à la présente clause relative à la protection des données à caractère personnel à tout moment. Si une modification est apportée à la présente clause de protection des données à caractère personnel, le site web s’engage à publier la nouvelle version sur son site. Le site web informera également les utilisateurs de la modification par messagerie électronique, dans un délai minimum de 15 jours avant la date d’effet. Si l’utilisateur n’est pas d’accord avec les termes de la nouvelle rédaction de la clause de protection des données à caractère personnel, il a la possibilité de supprimer son compte.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mentions légales */}
        <section id="mentions" className="bg-[#FBFAF8]">
          <div className="max-w-[780px] mx-auto px-4 lg:px-0 py-16 md:py-24">
            <h2 className="text-[28px] md:text-[36px] font-semibold leading-[1.1] tracking-tight text-foreground mb-10">
              Mentions légales &amp; Politique de confidentialité
            </h2>

            <div className="space-y-8 text-[15px] text-muted-foreground leading-[1.7]">
              <p>L’entreprise individuelle – micro-entreprise So-ma, soucieuse des droits des individus, notamment au regard des traitements automatisés et dans une volonté de transparence avec ses clients, a mis en place une politique reprenant l’ensemble de ces traitements, des finalités poursuivies par ces derniers ainsi que des moyens d’actions à la disposition des individus afin qu’ils puissent au mieux exercer leurs droits. Pour toute information complémentaire sur la protection des données personnelles, nous vous invitons à consulter le site : <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/</a></p>

              <p>La poursuite de la navigation sur ce site vaut acceptation sans réserve des dispositions et conditions d’utilisation qui suivent.</p>

              <p>La version actuellement en ligne de ces conditions d’utilisation est la seule opposable pendant toute la durée d’utilisation du site et jusqu’à ce qu’une nouvelle version la remplace.</p>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 1 – Mentions légales</h3>
                <div className="bg-white rounded-2xl p-6 border border-warm-border space-y-3">
                  <p><strong className="text-foreground">1.1 Site :</strong> <a href="https://so-ma.fr" className="text-primary hover:underline">https://so-ma.fr</a></p>
                  <p>
                    <strong className="text-foreground">1.2 Éditeur :</strong> Gwennaelle Segut — L’entreprise individuelle micro-entreprise So-ma, immatriculée sous le SIRET 91159168300014
                    <br />
                    <span className="text-muted-foreground">Adresse :</span> 90 cours Lafayette, Toulon
                    <br />
                    <span className="text-muted-foreground">Email :</span> <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a>
                  </p>
                  <p><strong className="text-foreground">1.3 Hébergeur :</strong> so-ma.fr est hébergé par OVHCloud France, dont le siège social est situé 2 rue Kellermann – 59100 Roubaix – France.</p>
                  <p><strong className="text-foreground">1.4 Délégué à la protection des données (DPO) :</strong> Un délégué à la protection des données : So-ma, <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a>, est à votre disposition pour toute question relative à la protection de vos données personnelles.</p>
                </div>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 2 – Accès au site</h3>
                <p>L’accès au site et son utilisation sont réservés à un usage strictement personnel. Vous vous engagez à ne pas utiliser ce site et les informations ou données qui y figurent à des fins commerciales, politiques, publicitaires et pour toute forme de sollicitation commerciale et notamment l’envoi de courriers électroniques non sollicités.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 3 – Contenu du site</h3>
                <p>Toutes les marques, photographies, textes, commentaires, illustrations extérieurs, images animées ou non, séquences vidéo, sons, ainsi que toutes les applications informatiques qui pourraient être utilisées pour faire fonctionner ce site et plus généralement tous les éléments reproduits ou utilisés sur le site sont protégés par les lois en vigueur au titre de la propriété intellectuelle.</p>
                <p className="mt-2">Ils sont la propriété pleine et entière de l’éditeur ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, y compris les applications informatiques, sans l’accord préalable et écrit de l’éditeur, est strictement interdite. Le fait pour l’éditeur de ne pas engager de procédure dès la prise de connaissance de ces utilisations non autorisées ne vaut pas acceptation desdites utilisations et renonciation aux poursuites.</p>
                <p className="mt-3 text-xs text-foreground font-medium">© SO-MA – so-ma.fr</p>
                <p className="mt-2">L’ensemble des éléments graphiques, illustrations, logos, concept et contenus présents sur ce site ou créés sous le nom de marque SO-MA sont des œuvres originales protégées par les lois françaises et internationales relatives à la propriété intellectuelle.</p>
                <p className="mt-2">Toute reproduction, diffusion, modification ou usage commercial sans autorisation écrite préalable est strictement interdite.</p>
                <p className="mt-3 text-xs text-foreground font-medium">© SO-MA All rights reserved. Original creation. Any reproduction or distribution without prior authorization is strictly prohibited.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 4 – Gestion du site</h3>
                <p>Pour la bonne gestion du site, l’éditeur pourra à tout moment :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>suspendre, interrompre ou limiter l’accès à tout ou partie du site, réserver l’accès au site, ou à certaines parties du site, à une catégorie déterminée d’internautes ;</li>
                  <li>supprimer toute information pouvant en perturber le fonctionnement ou entrant en contravention avec les lois nationales ou internationales ;</li>
                  <li>suspendre le site afin de procéder à des mises à jour.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 5 – Responsabilités</h3>
                <p>La responsabilité de l’éditeur ne peut être engagée en cas de défaillance, panne, difficulté ou interruption de fonctionnement, empêchant l’accès au site ou à une de ses fonctionnalités.</p>
                <p className="mt-2">Le matériel de connexion au site que vous utilisez est sous votre entière responsabilité. Vous devez prendre toutes les mesures appropriées pour protéger votre matériel et vos propres données, notamment d’attaques virales par Internet. Vous êtes par ailleurs seul responsable des sites et données que vous consultez.</p>
                <p className="mt-2">L’éditeur ne pourra être tenu responsable en cas de poursuites judiciaires à votre encontre :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>du fait de l’usage du site ou de tout service accessible via Internet ;</li>
                  <li>du fait du non-respect par vous des présentes conditions générales.</li>
                </ul>
                <p className="mt-2">L’éditeur n’est pas responsable des dommages causés à vous-même, à des tiers et/ou à votre équipement du fait de votre connexion ou de votre utilisation du site et vous renoncez à toute action contre lui de ce fait. Si l’éditeur venait à faire l’objet d’une procédure amiable ou judiciaire en raison de votre utilisation du site, il pourra se retourner contre vous pour obtenir l’indemnisation de tous les préjudices, sommes, condamnations et frais qui pourraient découler de cette procédure.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 6 – Liens hypertextes</h3>
                <p>La mise en place par les utilisateurs de tous liens hypertextes vers tout ou partie du site est autorisée par l’éditeur. Tout lien devra être retiré sur simple demande de l’éditeur.</p>
                <p className="mt-2">Toute information accessible via un lien vers d’autres sites n’est pas publiée par l’éditeur. L’éditeur ne dispose d’aucun droit sur le contenu présent dans ledit lien.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 7 – Collecte et protection des données</h3>
                <p>Vos données sont collectées par l’entreprise individuelle So-ma.</p>
                <p className="mt-2">Une donnée à caractère personnel désigne toute information concernant une personne physique identifiée ou identifiable (personne concernée) ; est réputée identifiable une personne qui peut être identifiée, directement ou indirectement, notamment par référence à un nom, un numéro d’identification ou à un ou plusieurs éléments spécifiques, propres à son identité physique, physiologique, génétique, psychique, économique, culturelle ou sociale.</p>
                <p className="mt-2">Les informations personnelles pouvant être recueillies sur le site sont principalement utilisées par l’éditeur pour la gestion des relations avec vous, et le cas échéant pour le traitement de vos commandes.</p>
                <p className="mt-2">Les données personnelles collectées sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>nom et prénom</li>
                  <li>adresse</li>
                  <li>adresse mail</li>
                  <li>numéro de téléphone</li>
                  <li>données financières : dans le cadre du paiement des produits et prestations proposés sur la Plateforme, celle-ci enregistre des données financières relatives à la carte de crédit de l’utilisateur.</li>
                </ul>
                <p className="mt-2">Un délégué à la protection des données : So-ma, <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a> est à votre disposition pour toute question relative à la protection de vos données personnelles.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 8 – Droit d’accès, de rectification et de déréférencement de vos données</h3>
                <p>En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent des droits suivants :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-foreground">Le droit d’accès :</strong> ils peuvent exercer leur droit d’accès, pour connaître les données personnelles les concernant, en écrivant à l’adresse électronique ci-dessous mentionnée : <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a>. Dans ce cas, avant la mise en œuvre de ce droit, la Plateforme peut demander une preuve de l’identité de l’utilisateur afin d’en vérifier l’exactitude.</li>
                  <li><strong className="text-foreground">Le droit de rectification :</strong> si les données à caractère personnel détenues par la Plateforme sont inexactes, ils peuvent demander la mise à jour des informations.</li>
                  <li><strong className="text-foreground">Le droit de suppression des données :</strong> les utilisateurs peuvent demander la suppression de leurs données à caractère personnel, conformément aux lois applicables en matière de protection des données.</li>
                  <li><strong className="text-foreground">Le droit à la limitation du traitement :</strong> les utilisateurs peuvent demander à la Plateforme de limiter le traitement des données personnelles conformément aux hypothèses prévues par le RGPD.</li>
                  <li><strong className="text-foreground">Le droit de s’opposer au traitement des données :</strong> les utilisateurs peuvent s’opposer à ce que leurs données soient traitées conformément aux hypothèses prévues par le RGPD.</li>
                  <li><strong className="text-foreground">Le droit à la portabilité :</strong> ils peuvent réclamer que la plateforme leur remette les données personnelles qu’ils ont fournies pour les transmettre à une nouvelle plateforme.</li>
                </ul>
                <p className="mt-2">Vous pouvez exercer ce droit en nous contactant par e-mail, à l’adresse : <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
                <p className="mt-2">Vous pouvez aussi vous adresser à notre délégué à la protection des données : So-ma, <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a> qui est à votre disposition pour toute question relative à la protection de vos données personnelles.</p>
                <p className="mt-2">Toute demande doit être accompagnée de la photocopie d’un titre d’identité en cours de validité signé et faire mention de l’adresse à laquelle l’éditeur pourra contacter le demandeur. La réponse sera adressée dans le mois suivant la réception de la demande. Ce délai d’un mois peut être prolongé de deux mois si la complexité de la demande et/ou le nombre de demandes l’exigent.</p>
                <p className="mt-2">De plus, et depuis la loi nᵒ 2016-1321 du 7 octobre 2016, les personnes qui le souhaitent ont la possibilité d’organiser le sort de leurs données après leur décès. Pour plus d’information sur le sujet, vous pouvez consulter le site Internet de la CNIL : <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/</a></p>
                <p className="mt-2">Les utilisateurs peuvent aussi introduire une réclamation auprès de la CNIL sur le site de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr</a></p>
                <p className="mt-2">Nous vous recommandons de nous contacter dans un premier temps avant de déposer une réclamation auprès de la CNIL, car nous sommes à votre entière disposition pour régler votre problème.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 9 – Utilisation des données</h3>
                <p>Les données personnelles collectées auprès des utilisateurs ont pour objectif la mise à disposition des services de la Plateforme, leur amélioration et le maintien d’un environnement sécurisé. La base légale des traitements est l’exécution du contrat entre l’utilisateur et la plateforme. Plus précisément, les utilisations sont les suivantes :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>accès et utilisation de la Plateforme par l’utilisateur ;</li>
                  <li>gestion du fonctionnement et optimisation de la plateforme ;</li>
                  <li>mise en œuvre d’une assistance utilisateurs ;</li>
                  <li>vérification, identification et authentification des données transmises par l’utilisateur ;</li>
                  <li>personnalisation des services en affichant des publicités en fonction de l’historique de navigation de l’utilisateur, selon ses préférences ;</li>
                  <li>prévention et détection des fraudes, malwares (malicious softwares ou logiciels malveillants) et gestion des incidents de sécurité ;</li>
                  <li>gestion des éventuels litiges avec les utilisateurs ;</li>
                  <li>envoi d’informations commerciales et publicitaires, en fonction des préférences de l’utilisateur ;</li>
                  <li>organisation des conditions d’utilisation des services de paiement.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 10 – Politique de conservation des données</h3>
                <p>La Plateforme conserve vos données pour la durée nécessaire pour vous fournir ses services ou son assistance.</p>
                <p className="mt-2">Dans la mesure raisonnablement nécessaire ou requise pour satisfaire aux obligations légales ou réglementaires, régler des litiges, empêcher les fraudes et abus ou appliquer nos modalités et conditions, nous pouvons également conserver certaines de vos informations si nécessaire, même après que vous ayez fermé votre compte ou que nous n’ayons plus besoin pour vous fournir nos services.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 11 – Partage des données personnelles avec des tiers</h3>
                <p>Les données personnelles peuvent être partagées avec des sociétés tierces exclusivement dans l’Union européenne, dans les cas suivants :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>quand l’utilisateur utilise les services de paiement, pour la mise en œuvre de ces services, la Plateforme est en relation avec des sociétés bancaires et financières tierces avec lesquelles elle a passé des contrats ;</li>
                  <li>lorsque l’utilisateur publie, dans les zones de commentaires libres de la Plateforme, des informations accessibles au public ;</li>
                  <li>quand l’utilisateur autorise le site web d’un tiers à accéder à ses données ;</li>
                  <li>quand la Plateforme recourt aux services de prestataires pour fournir l’assistance utilisateurs, la publicité et les services de paiement. Ces prestataires disposent d’un accès limité aux données de l’utilisateur, dans le cadre de l’exécution de ces prestations, et ont l’obligation contractuelle de les utiliser en conformité avec les dispositions de la réglementation applicable en matière de protection des données à caractère personnel ;</li>
                  <li>si la loi l’exige, la Plateforme peut effectuer la transmission de données pour donner suite aux réclamations présentées contre la Plateforme et se conformer aux procédures administratives et judiciaires.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 12 – Cookies</h3>
                <p className="font-medium text-foreground">Qu’est-ce qu’un « cookie » ?</p>
                <p className="mt-2">Un « cookie » ou traceur est un fichier électronique déposé sur un terminal (ordinateur, tablette, smartphone, …) et lu par exemple lors de la consultation d’un site internet, de la lecture d’un courrier électronique, de l’installation ou de l’utilisation d’un logiciel ou d’une application mobile, et ce, quel que soit le type de terminal utilisé (source : <a href="https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi</a>).</p>
                <p className="mt-2">En naviguant sur ce site, des « cookies » émanant de la société responsable du site concerné et/ou des sociétés tiers pourront être déposés sur votre terminal.</p>
                <p className="mt-2">Lors de la première navigation sur ce site, une bannière explicative sur l’utilisation des « cookies » apparaîtra. Dès lors, en poursuivant la navigation, le client et/ou prospect sera réputé informé et avoir accepté l’utilisation desdits « cookies ». Le consentement donné sera valable pour une période de treize (13) mois. L’utilisateur a la possibilité de désactiver les cookies à partir des paramètres de son navigateur.</p>
                <p className="mt-2">Toutes les informations collectées ne seront utilisées que pour suivre le volume, le type et la configuration du trafic utilisant ce site, pour en développer la conception et l’agencement et à d’autres fins administratives et de planification et plus généralement pour améliorer le service que nous vous offrons.</p>
                <p className="mt-2">Les cookies suivants sont présents sur ce site :</p>
                <p className="mt-2 font-medium text-foreground">Cookies Google :</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-foreground">Google Analytics :</strong> permet de mesurer l’audience du site ;</li>
                  <li><strong className="text-foreground">Google Tag Manager :</strong> facilite l’implémentation des tags sur les pages et permet de gérer les balises Google ;</li>
                  <li><strong className="text-foreground">Google AdSense :</strong> régie publicitaire de Google utilisant les sites web ou les vidéos YouTube comme support pour ses annonces ;</li>
                  <li><strong className="text-foreground">Google Dynamic Remarketing :</strong> permet de vous proposer de la publicité dynamique en fonction des précédentes recherches ;</li>
                  <li><strong className="text-foreground">Google AdWords Conversion :</strong> outil de suivi des campagnes publicitaires AdWords ;</li>
                  <li><strong className="text-foreground">DoubleClick :</strong> cookies publicitaires de Google pour diffuser des bannières.</li>
                </ul>
                <p className="mt-2">La durée de vie de ces cookies est de treize mois.</p>
                <p className="mt-2">Pour plus d’informations sur l’utilisation, la gestion et la suppression des « cookies », pour tout type de navigateur, nous vous invitons à consulter le lien suivant : <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser</a>.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 13 – Photographies et représentation des produits</h3>
                <p>Les photographies de produits, accompagnant leur description, appartiennent de droit à l’entreprise So-ma. En cas contraire, ça sera précisé.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 14 – Loi applicable</h3>
                <p>Les présentes conditions d’utilisation du site sont régies par la loi française et soumises à la compétence des tribunaux du siège social de l’éditeur, sous réserve d’une attribution de compétence spécifique découlant d’un texte de loi ou réglementaire particulier.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 15 – Contactez-nous</h3>
                <p>Pour toute question, information sur les produits présentés sur le site, ou concernant le site lui-même, vous pouvez laisser un message à l’adresse suivante : <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
