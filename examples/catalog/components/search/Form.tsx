import { useState } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const Form: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [q, setQ] = useState(router.query.q ?? '');
  const [sort, setSort] = useState(router.query.sort ?? '');

  const handleChange = (event) => {
    if (event.target.name === 'q') {
      setQ(event.target.value);
    } else if (event.target.name === 'sort') {
      setSort(event.target.value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ q, sort, locale: router.locale });
    router.push(
      {
        pathname: 'search',
        query: { q, sort },
      },
      {
        pathname: 'search',
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="items-center">
      <div className="flex">
        <input
          type="text"
          name="q"
          value={q}
          onChange={handleChange}
          placeholder={t(`common:Search`)}
          aria-label={t(`common:Search`)}
          className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 w-1/2 rounded-lg py-2 px-4 block appearance-none leading-normal"
        />
        <button
          onClick={handleSubmit}
          className="inline-block text-sm px-4 py-3 mx-3 leading-none border rounded text-white bg-black border-black lg:mt-0"
        >
          {t(`common:Search`)}
        </button>
      </div>
      <div className="inline-block my-6 order-field">
        <label htmlFor="field-order-by">{t(`common:Order by`)}:</label>
        <select
          className="bg-white"
          id="field-order-by"
          name="sort"
          onChange={handleChange}
          onBlur={handleChange}
          value={sort}
        >
          <option value="score:desc">{t(`common:Relevance`)}</option>
          <option value="title_string:asc">
            {t(`common:Name Ascending`)}
          </option>
          <option value="title_string:desc">
            {t(`common:Name Descending`)}
          </option>
          <option value="metadata_modified:desc">
            {t(`common:Last Modified`)}
          </option>
          <option value="views_recent:desc">{t(`common:Popular`)}</option>
        </select>
      </div>
    </form>
  );
};

export default Form;
