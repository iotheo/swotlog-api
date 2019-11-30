import { hasProp } from 'utils';

const mapTableColumns = {
  hasSubscribed: 'has_subscribed',
  hasPassed: 'has_passed',
};

const getUpdateClassQuery = (params, fromIndex = 3) => {
  const getAppropriateParams = () => Object.keys(params)
    .reduce((obj, param) => {
      if (hasProp(mapTableColumns, param)) {
        obj[param] = params[param];

        return obj;
      }

      return obj;
    }, {});

  const appropriateParams = getAppropriateParams();

  const appendCols = () => {
    if (!Object.keys(appropriateParams).length) {
      return '';
    }

    const cols = Object.keys(appropriateParams).map(key => mapTableColumns[key]);

    // e.g ,has_passed, has_subscribed
    return `,${Object.values(cols).join(', ')}`;
  };

  const appendPreparedStatements = () => {
    if (!Object.keys(appropriateParams).length) {
      return '';
    }

    // e.g. ,$3, $4, $5
    return `, ${Object.keys(appropriateParams)
      .map((_, index) => `$${index + fromIndex}`)
      .join(', ')}`;
  };

  const getConflictStatements = () => {
    if (!Object.keys(appropriateParams).length) {
      return 'NOTHING';
    }

    const leadingStatement = `UPDATE
    SET `;

    const statement = Object.keys(appropriateParams)
      .map((key, index) => `${mapTableColumns[key]} = $${index + fromIndex}`)
      .join(', ');

    return leadingStatement + statement;
  };

  const updateClassQuery = `
      INSERT INTO class_student (
        student_id,
        class_id
        ${appendCols()}
      )
        VALUES ($1, $2
        ${appendPreparedStatements()}
        )
        ON CONFLICT ON CONSTRAINT class_student_id
          DO ${getConflictStatements()}`;

  return updateClassQuery;
};


export default getUpdateClassQuery;
