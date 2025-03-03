import { GetServerSideProps } from 'next';
import { useQuery } from '@apollo/react-hooks';
import Head from 'next/head';
import { initializeApollo } from '../../../../../lib/apolloClient';
import Nav from '../../../../../components/home/Nav';
import About from '../../../../../components/resource/About';
import DataExplorer from '../../../../../components/resource/DataExplorer';
import { loadNamespaces } from '../../../../_app';
import { GET_RESOURCES_QUERY } from '../../../../../graphql/queries';
import useTranslation from 'next-translate/useTranslation';

const Resource: React.FC<{ variables: any }> = ({ variables }) => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_RESOURCES_QUERY, { variables });

  if (loading) return <div>{t(`common:Loading`)}</div>;
  const result = data.dataset.result;
  // Find right resource
  const resource = result.resources.find(
    (item) => item.name === variables.resource
  );
  return (
    <>
      <Head>
        <title>
          {t(`common:Portal`)} |{' '}
          {t(`common:${resource.title || resource.name}`, undefined, {
            returnObjects: false,
            fallback: resource.title || resource.name,
          })}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="p-6">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          {t(`common:${resource.title || resource.name}`, undefined, {
            returnObjects: false,
            fallback: resource.title || resource.name,
          })}
        </h1>
        <About variables={variables} />
        <DataExplorer variables={variables} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const variables = {
    id: context.query.dataset,
    resource: context.query.resource,
  };

  await apolloClient.query({
    query: GET_RESOURCES_QUERY,
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

export default Resource;
