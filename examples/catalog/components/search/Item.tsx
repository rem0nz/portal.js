/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

const Item: React.FC<{ datapackage: any }> = ({ datapackage }) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold">
        <Link
          href={`/@${
            datapackage.organization
              ? datapackage.organization.name
              : 'dataset'
          }/${datapackage.name}`}
        >
          <a className="text-primary">
            {t(`common:${datapackage.title || datapackage.name}`, undefined, {
              returnObjects: false,
              fallback: datapackage.title || datapackage.name,
            })}
          </a>
        </Link>
      </h3>
      <Link
        href={`/@${
          datapackage.organization ? datapackage.organization.name : 'dataset'
        }`}
      >
        <a className="text-gray-500 block mt-1">
          {datapackage.organization
            ? t(`common:${datapackage.organization.title}`, undefined, {
                returnObjects: false,
                fallback: datapackage.organization.title,
              })
            : t(`common:dataset`)}
        </a>
      </Link>
      <div className="leading-relaxed mt-2">
        {datapackage.description ||
          (datapackage.notes &&
            t(`common:${datapackage.description || datapackage.notes}`))}
      </div>
    </div>
  );
};

export default Item;
