import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/react-hooks';
import Head from 'next/head';
import { initializeApollo } from '../../../lib/apolloClient';
import Nav from '../../../components/home/Nav';
import About from '../../../components/dataset/About';
import Org from '../../../components/dataset/Org';
import Resources from '../../../components/dataset/Resources';
import { GET_DATASET_QUERY } from '../../../graphql/queries';
import { loadNamespaces } from '../../_app';
import useTranslation from 'next-translate/useTranslation';

const Dataset: React.FC<{ variables: any }> = ({ variables }) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_DATASET_QUERY, { variables });

  if (loading) return <div>{t(`common:Loading`)}</div>;
  const { result } = data.dataset;

  return (
    <>
      <Head>
        <title>
          {t(`common:Portal`)} |{' '}
          {t(`common:${result.title || result.name}`, undefined, {
            returnObjects: false,
            fallback: result.title || result.name,
          })}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="p-6">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          {t(`common:${result.title || result.name}`, undefined, {
            returnObjects: false,
            fallback: result.title || result.name,
          })}
        </h1>
        <Org variables={variables} />
        <About variables={variables} />
        <Resources variables={variables} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const variables = {
    id: context.query.dataset,
  };

  await apolloClient.query({
    query: GET_DATASET_QUERY,
    variables,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(['common'], context.locale),
      variables,
    },
  };
};

export default Dataset;
