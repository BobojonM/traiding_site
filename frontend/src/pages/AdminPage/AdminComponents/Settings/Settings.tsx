import { FC, useEffect, useState } from "react";
import styles from './Settings.module.css';
import RegularButton from "../../../../components/UI/Buttons/RegularButton";
import RuleService from "../../../../servises/RuleService";
import { ILevarage } from "../../../../models/ILevarage";

const Settings: FC = () => {
  const [levarages, setLevarages] = useState<ILevarage[]>([]);
  const [leverage, setLeverage] = useState('');
  const [key, setKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [validationError, setValidationError] = useState('');

  const fetchLevarages = async () => {
    try {
      const response = (await RuleService.getLevarages()).data;
      setLevarages([...response]);
      const settingsResponse = (await RuleService.getOptions()).data;
      console.log(settingsResponse);
      
      setLeverage(response.filter((elem) => elem.id === settingsResponse.selected_lev)[0].name);
      setKey(settingsResponse.apikey);
      setSecretKey(settingsResponse.secret);      
    } catch(e: any){
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLevarages();
  }, []);

  const handleSave = async () => {
    if (key.trim() === "" || secretKey.trim() === "") {
      // Display an error message or perform validation as needed
      setValidationError("Ключ и секретный ключ не должны быть пустыми");
    } else {
      try {
        const lev_id = levarages.find((item) => item.name === leverage)?.id;
        if (lev_id){
          await RuleService.updateOption(key, secretKey, lev_id);
          setIsEditing(false);
        }
      } catch(e: any){
        console.error(e);
      }
    }
  };

  return (
    <div className={styles.settings}>
      <h1>Настройки</h1>
      {validationError 
      ? (
        <div className={styles.error}>{validationError}</div>
      )
      : null}
      <form className={styles.settingsForm}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Плечо:</label>
            {isEditing ? (
            <select
                className={styles.select}
                value={leverage || ''}
                onChange={(e) => setLeverage(e.target.value)}
            >
              <option value='-'>--</option>
              {levarages.map((item: ILevarage) => (
                <option value={item.name}>{item.name}</option>
              ))}
            </select>
            ) : (
                <span>{leverage}</span>
            )}

            <label className={styles.label}>Общий риск капитала:</label>
            {isEditing ? (
                <input
                    className={styles.input}
                    type="text"
                    value={"1"}
                    onChange={(e) => setKey(e.target.value)}
                />
            ) : (
                <span className={styles.span}>1%</span>
            )}

            <label className={styles.label}>Ключ:</label>
            {isEditing ? (
                <input
                    className={styles.input}
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />
            ) : (
                <span className={styles.span}>****************</span>
            )}

            <label className={styles.label}>Секретный ключ:</label>
            {isEditing ? (
                <input
                    className={styles.input}
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                />
            ) : (
                <span className={styles.span}>****************</span>
            )}
        </div>
            
        <div className={styles.buttonGroup}>
          {isEditing ? (
            <RegularButton action={handleSave}>
              Сохранить
            </RegularButton>
            ) : (
            <RegularButton action={() => setIsEditing(true)}>
              Изменить
            </RegularButton>
          )}
        </div>

      </form>
    </div>
  );
};

export default Settings;
