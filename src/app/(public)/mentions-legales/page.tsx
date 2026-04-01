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
                <p>Les présentes conditions générales de vente s&apos;appliquent à toutes les ventes conclues sur le site Internet so-ma.fr</p>
                <p className="mt-2">Les présentes conditions générales de vente sont conclues entre&nbsp;:</p>
                <p className="mt-2"><strong className="text-foreground">SO-MA</strong>, entreprise individuelle micro-entreprise immatriculée sous le SIRET 91159168300014, dont les informations légales complètes figurent dans la page «&nbsp;Mentions légales&nbsp;» du site.</p>
                <p className="mt-2">Le site Internet <a href="https://so-ma.fr/" className="text-primary hover:underline">https://so-ma.fr/</a> commercialise les produits suivants&nbsp;: programmes diététiques, alimentaires et sportifs.</p>
                <p className="mt-2">Le client déclare avoir pris connaissance et avoir accepté les conditions générales de vente antérieurement à la passation de sa commande. La validation de la commande vaut donc acceptation des conditions générales de vente.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 1 – Principes</h3>
                <p>Les présentes conditions générales expriment l&apos;intégralité des obligations des parties. En ce sens, l&apos;acheteur est réputé les accepter sans réserve.</p>
                <p className="mt-2">Les présentes conditions générales de vente s&apos;appliquent à l&apos;exclusion de toutes autres conditions, et notamment celles applicables pour les ventes en magasin ou au moyen d&apos;autres circuits de distribution et de commercialisation. Elles sont accessibles sur le site internet so-ma.fr et prévaudront, le cas échéant, sur toute autre version ou tout autre document contradictoire.</p>
                <p className="mt-2">Le vendeur et l&apos;acheteur conviennent que les présentes conditions générales régissent exclusivement leur relation. Le vendeur se réserve le droit de modifier ponctuellement ses conditions générales. Elles seront applicables dès leur mise en ligne.</p>
                <p className="mt-2">Si une condition de vente venait à faire défaut, elle serait considérée comme étant régie par les usages en vigueur dans le secteur de la vente à distance dont les sociétés ont leur siège en France. Les conditions générales de vente sont les seules conditions applicables à la transaction.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 2 – Contenu</h3>
                <p>Les présentes conditions ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne de biens proposés par le vendeur à l&apos;acheteur, à partir du site internet <a href="https://so-ma.fr/" className="text-primary hover:underline">https://so-ma.fr/</a></p>
                <p className="mt-2">Ces achats concernent les produits suivants&nbsp;: programmes diététiques, alimentaires et sportifs.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 3 – Informations précontractuelles</h3>
                <p>L&apos;acheteur reconnaît avoir eu communication, préalablement à la passation de sa commande et à la conclusion du contrat, d&apos;une manière lisible et compréhensible, des présentes conditions générales de vente et de toutes les informations listées à l&apos;article L. 221-5 du code de la consommation.</p>
                <p className="mt-2">Sont transmises à l&apos;acheteur, de manière claire et compréhensible, les informations suivantes&nbsp;:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>les caractéristiques essentielles du bien&nbsp;;</li>
                  <li>le prix du bien et/ou le mode de calcul du prix&nbsp;;</li>
                  <li>s&apos;il y a lieu, tous les autres frais éventuels exigibles&nbsp;;</li>
                  <li>en l&apos;absence d&apos;exécution immédiate du contrat, la date ou le délai auquel le vendeur s&apos;engage à livrer le bien&nbsp;;</li>
                  <li>les informations relatives à l&apos;identité du vendeur et à ses activités, celles relatives aux garanties légales, aux fonctionnalités du contenu numérique.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 4 – La commande</h3>
                <p>L&apos;acheteur a la possibilité de passer sa commande en ligne, à partir du catalogue en ligne pour tout produit, dans la limite des stocks disponibles.</p>
                <p className="mt-2">Pour que la commande soit validée, l&apos;acheteur devra accepter, en cliquant à l&apos;endroit indiqué, les présentes conditions générales. La vente sera considérée comme définitive après l&apos;envoi à l&apos;acheteur de la confirmation de l&apos;acceptation de la commande par le vendeur par courrier électronique, et après encaissement par le vendeur de l&apos;intégralité du prix.</p>
                <p className="mt-2">Dans certains cas, notamment défaut de paiement, adresse erronée ou autre problème sur le compte de l&apos;acheteur, le vendeur se réserve le droit de bloquer la commande de l&apos;acheteur jusqu&apos;à la résolution du problème.</p>
                <p className="mt-2">Pour toute question relative au suivi d&apos;une commande, l&apos;acheteur peut contacter le service client à l&apos;adresse mail suivante&nbsp;: <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 5 – Signature électronique</h3>
                <p>La fourniture en ligne du numéro de carte bancaire de l&apos;acheteur et la validation finale de la commande vaudront preuve de l&apos;accord de l&apos;acheteur&nbsp;: exigibilité des sommes dues au titre du bon de commande, signature et acceptation expresse de toutes les opérations effectuées.</p>
                <p className="mt-2">En cas d&apos;utilisation frauduleuse de la carte bancaire, l&apos;acheteur est invité, dès le constat de cette utilisation, à contacter le service client.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 6 – Confirmation de commande</h3>
                <p>Le vendeur fournit à l&apos;acheteur une confirmation de commande, par messagerie électronique.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 7 – Preuve de la transaction</h3>
                <p>Les registres informatisés, conservés dans les systèmes informatiques du vendeur dans des conditions raisonnables de sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les parties.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 8 – Informations sur les produits</h3>
                <p>Les produits régis par les présentes conditions générales sont ceux qui figurent sur le site internet du vendeur et qui sont indiqués comme vendus et expédiés par le vendeur. Ils sont proposés dans la limite des stocks disponibles.</p>
                <p className="mt-2">Les photographies des produits appartiennent à l&apos;entreprise So-ma et sont interdites de reproduction, ou d&apos;utilisation sans autorisation.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 9 – Prix</h3>
                <p>Le vendeur se réserve le droit de modifier ses prix à tout moment mais s&apos;engage à appliquer les tarifs en vigueur indiqués au moment de la commande, sous réserve de disponibilité à cette date.</p>
                <p className="mt-2">Les prix sont indiqués en euros et tiennent compte de la TVA applicable au jour de la commande.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 10 – Mode de paiement</h3>
                <p>Il s&apos;agit d&apos;une commande avec obligation de paiement. Le paiement du prix s&apos;effectue en totalité au jour de la commande, selon les modalités suivantes&nbsp;:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Carte bancaire (paiement comptant)</li>
                  <li>PayPal</li>
                </ul>
                <p className="mt-2">Le paiement du prix peut également être effectué selon un échéancier, avec un montant et des versements échelonnés sur une période déterminée entre le vendeur et l&apos;acheteur au cas par cas.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 11 – Garantie des produits</h3>
                <p>Conformément aux articles 1641 et suivants du code civil, le vendeur est garant des vices cachés pouvant affecter le bien vendu. Cette garantie doit être mise en œuvre dans un délai de deux ans à compter de la découverte du vice.</p>
                <p className="mt-2">L&apos;acheteur peut choisir entre la résolution de la vente ou une réduction du prix conformément à l&apos;article 1644 du code civil.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 12 – Droit de rétractation</h3>
                <p>Le droit de rétractation ne s&apos;applique pas dans ce cas, où l&apos;accès à la commande est immédiat et définitif (sauf cas exceptionnels).</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 13 – Force majeure</h3>
                <p>Toutes circonstances indépendantes de la volonté des parties empêchant l&apos;exécution dans des conditions normales de leurs obligations sont considérées comme des causes d&apos;exonération des obligations des parties et entraînent leur suspension.</p>
                <p className="mt-2">Si le cas de force majeure a une durée supérieure à trois mois, les présentes conditions générales pourront être résiliées par la partie lésée.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 14 – Propriété intellectuelle</h3>
                <p>Le contenu du site internet reste la propriété du vendeur, seul titulaire des droits de propriété intellectuelle sur ce contenu. Toute reproduction totale ou partielle de ce contenu est strictement interdite et est susceptible de constituer un délit de contrefaçon.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 15 – Informatique et libertés</h3>
                <p>Les données nominatives fournies par l&apos;acheteur sont nécessaires au traitement de sa commande et à l&apos;établissement des factures. L&apos;acheteur dispose d&apos;un droit d&apos;accès permanent, de modification, de rectification et d&apos;opposition s&apos;agissant des informations le concernant. Ce droit peut être exercé dans les conditions et selon les modalités définies sur le site so-ma.fr.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Articles 16 à 19</h3>
                <p><strong className="text-foreground">Non-validation partielle&nbsp;:</strong> Si une ou plusieurs stipulations des présentes conditions générales sont tenues pour non valides, les autres stipulations garderont toute leur force et leur portée.</p>
                <p className="mt-2"><strong className="text-foreground">Non-renonciation&nbsp;:</strong> Le fait pour l&apos;une des parties de ne pas se prévaloir d&apos;un manquement par l&apos;autre partie ne saurait être interprété pour l&apos;avenir comme une renonciation à l&apos;obligation en cause.</p>
                <p className="mt-2"><strong className="text-foreground">Langue du contrat&nbsp;:</strong> Les présentes conditions générales de vente sont rédigées en langue française. Seul le texte français fait foi en cas de litige.</p>
                <p className="mt-2"><strong className="text-foreground">Loi applicable&nbsp;:</strong> Les présentes conditions générales sont soumises à l&apos;application du droit français. Le tribunal compétent est le tribunal judiciaire.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 20 – Protection des données personnelles</h3>
                <p><strong className="text-foreground">Données collectées&nbsp;:</strong> nom, prénom, adresse électronique, n° de téléphone, adresse postale, données de connexion, données financières relatives au compte bancaire ou à la carte de crédit, cookies.</p>
                <p className="mt-2"><strong className="text-foreground">Utilisation&nbsp;:</strong> accès et utilisation du site, gestion et optimisation du site, services de paiement, vérification et authentification, assistance utilisateurs, personnalisation des services, prévention des fraudes, gestion des litiges, envoi d&apos;informations commerciales.</p>
                <p className="mt-2"><strong className="text-foreground">Droits des utilisateurs&nbsp;:</strong> droit d&apos;accès, de rectification, de suppression, à la limitation du traitement, d&apos;opposition au traitement, et à la portabilité. Ces droits peuvent être exercés à l&apos;adresse&nbsp;: <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
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
              <p>L&apos;entreprise individuelle – micro-entreprise So-ma, soucieuse des droits des individus, notamment au regard des traitements automatisés et dans une volonté de transparence avec ses clients, a mis en place une politique reprenant l&apos;ensemble de ces traitements, des finalités poursuivies par ces derniers ainsi que des moyens d&apos;actions à la disposition des individus afin qu&apos;ils puissent au mieux exercer leurs droits.</p>
              <p>Pour toute information complémentaire sur la protection des données personnelles, nous vous invitons à consulter le site&nbsp;: <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/</a></p>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 1 – Mentions légales</h3>
                <div className="bg-white rounded-2xl p-6 border border-warm-border space-y-3">
                  <p><strong className="text-foreground">Site&nbsp;:</strong> so-ma.fr</p>
                  <p><strong className="text-foreground">Éditeur&nbsp;:</strong> Gwennaelle Segut — L&apos;entreprise individuelle micro-entreprise So-ma, immatriculée sous le SIRET 91159168300014</p>
                  <p><strong className="text-foreground">Adresse&nbsp;:</strong> 90 cours Lafayette, Toulon</p>
                  <p><strong className="text-foreground">Email&nbsp;:</strong> <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
                  <p><strong className="text-foreground">Hébergeur&nbsp;:</strong> OVHCloud France, 2 rue Kellermann – 59100 Roubaix – France</p>
                  <p><strong className="text-foreground">DPO&nbsp;:</strong> So-ma, <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
                </div>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 2 – Accès au site</h3>
                <p>L&apos;accès au site et son utilisation sont réservés à un usage strictement personnel. Vous vous engagez à ne pas utiliser ce site et les informations ou données qui y figurent à des fins commerciales, politiques, publicitaires et pour toute forme de sollicitation commerciale.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 3 – Contenu du site</h3>
                <p>Toutes les marques, photographies, textes, commentaires, illustrations, images, séquences vidéo, sons, ainsi que toutes les applications informatiques qui pourraient être utilisées pour faire fonctionner ce site sont protégés par les lois en vigueur au titre de la propriété intellectuelle.</p>
                <p className="mt-2">Ils sont la propriété pleine et entière de l&apos;éditeur ou de ses partenaires. Toute reproduction, représentation, utilisation ou adaptation, sous quelque forme que ce soit, sans l&apos;accord préalable et écrit de l&apos;éditeur, est strictement interdite.</p>
                <p className="mt-3 text-xs text-foreground font-medium">© SO-MA – so-ma.fr — All rights reserved. Original creation. Any reproduction or distribution without prior authorization is strictly prohibited.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Articles 4 &amp; 5 – Gestion du site &amp; Responsabilités</h3>
                <p>L&apos;éditeur pourra à tout moment suspendre, interrompre ou limiter l&apos;accès à tout ou partie du site. La responsabilité de l&apos;éditeur ne peut être engagée en cas de défaillance, panne, difficulté ou interruption de fonctionnement.</p>
                <p className="mt-2">Le matériel de connexion au site que vous utilisez est sous votre entière responsabilité.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 6 – Liens hypertextes</h3>
                <p>La mise en place par les utilisateurs de tous liens hypertextes vers tout ou partie du site est autorisée par l&apos;éditeur. Tout lien devra être retiré sur simple demande de l&apos;éditeur.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 7 – Collecte et protection des données</h3>
                <p>Vos données sont collectées par l&apos;entreprise individuelle So-ma. Les informations personnelles pouvant être recueillies sur le site sont principalement utilisées par l&apos;éditeur pour la gestion des relations avec vous, et le cas échéant pour le traitement de vos commandes.</p>
                <p className="mt-2"><strong className="text-foreground">Données personnelles collectées&nbsp;:</strong> nom et prénom, adresse, adresse mail, numéro de téléphone, données financières.</p>
                <p className="mt-2">Un délégué à la protection des données est à votre disposition&nbsp;: <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 8 – Droits des utilisateurs</h3>
                <p>En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent des droits suivants&nbsp;:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong className="text-foreground">Droit d&apos;accès&nbsp;:</strong> connaître les données personnelles les concernant</li>
                  <li><strong className="text-foreground">Droit de rectification&nbsp;:</strong> demander la mise à jour des informations</li>
                  <li><strong className="text-foreground">Droit de suppression&nbsp;:</strong> demander la suppression de leurs données</li>
                  <li><strong className="text-foreground">Droit à la limitation du traitement</strong></li>
                  <li><strong className="text-foreground">Droit d&apos;opposition au traitement</strong></li>
                  <li><strong className="text-foreground">Droit à la portabilité</strong></li>
                </ul>
                <p className="mt-2">Exercez ces droits par e-mail&nbsp;: <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
                <p className="mt-2">Toute demande doit être accompagnée de la photocopie d&apos;un titre d&apos;identité en cours de validité. Réponse dans le mois suivant la réception.</p>
                <p className="mt-2">Les utilisateurs peuvent aussi introduire une réclamation auprès de la CNIL&nbsp;: <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr</a></p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Articles 9 &amp; 10 – Utilisation et conservation des données</h3>
                <p>Les données personnelles collectées ont pour objectif la mise à disposition des services, leur amélioration et le maintien d&apos;un environnement sécurisé. La Plateforme conserve vos données pour la durée nécessaire pour vous fournir ses services ou son assistance.</p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Article 11 – Cookies</h3>
                <p>En naviguant sur ce site, des «&nbsp;cookies&nbsp;» pourront être déposés sur votre terminal. Lors de la première navigation, une bannière explicative sur l&apos;utilisation des «&nbsp;cookies&nbsp;» apparaîtra. Le consentement donné sera valable pour une période de treize (13) mois.</p>
                <p className="mt-2">L&apos;utilisateur a la possibilité de désactiver les cookies à partir des paramètres de son navigateur.</p>
                <p className="mt-2">Pour plus d&apos;informations&nbsp;: <a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser</a></p>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-foreground mb-2">Articles 13 à 15</h3>
                <p><strong className="text-foreground">Photographies&nbsp;:</strong> Les photographies de produits appartiennent de droit à l&apos;entreprise So-ma.</p>
                <p className="mt-2"><strong className="text-foreground">Loi applicable&nbsp;:</strong> Les présentes conditions d&apos;utilisation sont régies par la loi française et soumises à la compétence des tribunaux du siège social de l&apos;éditeur.</p>
                <p className="mt-2"><strong className="text-foreground">Contact&nbsp;:</strong> Pour toute question, vous pouvez laisser un message à l&apos;adresse&nbsp;: <a href="mailto:so.ma.service.client@proton.me" className="text-primary hover:underline">so.ma.service.client@proton.me</a></p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
